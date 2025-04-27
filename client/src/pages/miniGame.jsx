import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import AuthModal from '../components/AuthModal';
import Leaderboard from '../components/Leaderboard';

import dino0 from '../assets/dino0.png';
import dino1 from '../assets/dino1.png';
import dino2 from '../assets/dino2.png';
import dino3 from '../assets/dino3.png';
import dino4 from '../assets/dino4.png';
import dino5 from '../assets/dino5.png';
import dino6 from '../assets/dino6.png';
import dino7 from '../assets/dino7.png';
import dino8 from '../assets/dino8.png';
import dino9 from '../assets/dino9.png';
import dino10 from '../assets/dino10.png';
import dino11 from '../assets/dino11.png';

import lego0 from '../assets/lego0.png';
import lego1 from '../assets/lego1.png';
import lego2 from '../assets/lego2.png';
import lego3 from '../assets/lego3.png';

// 게임 상수 정의
const GAME_CONSTANTS = {
  KEY_ESC: 27,
  KEY_SPACE: 32,
  MAX_JUMP: 8,          // 점프 높이 증가
  Y_BASE: 200,          // 캔버스에서의 바닥 위치
  Y_COLLISION: 40,      // 충돌 체크 높이
  TREE_COLLISION: 70,   // 나무와 충돌 체크 X 위치
  TREE_START: 800,      // 나무 시작 위치 (캔버스 너비)
  TREE_END: -50,        // 나무가 사라지는 위치
  SLEEP_TIME: 16,       // 약 60FPS
  DINO_WIDTH: 40,
  DINO_HEIGHT: 40,
  TREE_WIDTH: 30,
  TREE_HEIGHT: 50,
  MIN_TREE_DISTANCE: 200,  // 최소 거리 증가
  MAX_TREE_DISTANCE: 600,   // 최대 거리 증가
  // 나무 생성 관련 상수 추가
  MIN_TREE_INTERVAL: 40,  // 최소 프레임 간격 
  MAX_TREE_INTERVAL: 150,  // 최대 프레임 간격 
  DINO_HITBOX_SHRINK: 8,
  BASE_HITBOX_WIDTH: 40,  // 기본 히트박스 너비
  BASE_HITBOX_HEIGHT: 40, // 기본 히트박스 높이
  MIN_SCALE: 0.5,         // 최소 스케일
  MAX_SCALE: 1.0,         // 최대 스케일
  ANIMATION_FRAME_RATE: 166.67, // 6 FPS
  SCORE_INCREASE_INTERVAL: 6,
  MAX_SPEED_INCREASE: 4,
  SPEED_INCREASE_FACTOR: 0.6,
  DOUBLE_TREE_CHANCE: 0.3
};

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
console.log('API_BASE_URL:', API_BASE_URL); // 디버깅용 로그 추가

const GameContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #000;
  padding: 20px 0;
  cursor: pointer;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  margin: 0;
  box-sizing: border-box;
  position: relative;
  z-index: 1;
  overflow-y: auto;  // 스크롤 활성화
  height: auto;      // 높이를 자동으로 설정
`;

const GameCanvas = styled.canvas`
  border: 2px solid #4eff4e;
  background-color: black;
  max-width: 100%;
  height: auto;
  touch-action: none;
`;

const ScoreDisplay = styled.div`
  font-size: clamp(18px, 5vw, 24px);
  margin: 200px 0 10px 0;
  font-weight: bold;
  color: #4eff4e;
  text-shadow: 0 0 10px rgba(78, 255, 78, 0.5);
`;

const GameOver = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.8);
  color: #4eff4e;
  padding: clamp(10px, 2vw, 15px);
  border-radius: 8px;
  text-align: center;
  display: ${props => props.show ? 'block' : 'none'};
  width: 80%;
  max-width: 300px;
  text-shadow: 0 0 10px rgba(78, 255, 78, 0.5);
  border: 1px solid #4eff4e;
  box-shadow: 0 0 10px rgba(78, 255, 78, 0.3);

  h2 {
    font-size: clamp(18px, 4vw, 24px);
    margin-bottom: 10px;
  }

  p {
    font-size: clamp(14px, 3vw, 18px);
    margin-bottom: 15px;
  }

  // 모바일 세로 화면에서 더 작게
  @media (max-width: 480px) and (orientation: portrait) {
    width: 90%;
    max-width: 220px;
    padding: 8px;
    h2 {
      font-size: 16px;
    }
    p {
      font-size: 12px;
    }
  }
`;

const RestartButton = styled.button`
  margin-top: 15px;
  padding: clamp(6px, 1.5vw, 8px) clamp(12px, 2.5vw, 15px);
  background-color: #4eff4e;
  color: black;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: clamp(12px, 3vw, 14px);
  font-weight: bold;
  
  &:hover {
    background-color: #45ff45;
  }
`;

const GameBoxWrapper = styled.div`
  width: 90%;
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LoginNotice = styled.p`
  color: #ff4e4e;
  font-size: 14px;
  margin-bottom: 10px;

  @media (max-width: 480px) and (orientation: portrait) {
    font-size: 11px;
    margin-bottom: 7px;
  }
`;

// 게임 클래스 정의
class GameState {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false });
    this.score = 0;
    this.frameCount = 0;
    this.lastAnimationTime = Date.now();
    this.lastMoveTime = Date.now();
    this.nextTreeTime = 0;
    this.initialSpeed = 5;
    this.gameSpeed = this.initialSpeed;
    this.lastScoreFrame = 0;
    
    const scale = canvas.width / 800;
    this.scale = Math.min(Math.max(scale, GAME_CONSTANTS.MIN_SCALE), GAME_CONSTANTS.MAX_SCALE);
    this.hitboxScale = this.scale; // 히트박스용 별도 스케일
    
    this.initializeDino(scale);
    this.trees = [];
    this.isCollision = false;
  }

  initializeDino(scale) {
    this.dino = {
      x: 50 * scale,
      y: GAME_CONSTANTS.Y_BASE * scale,
      width: GAME_CONSTANTS.DINO_WIDTH * scale,
      height: GAME_CONSTANTS.DINO_HEIGHT * scale,
      jumping: false,
      jumpStartTime: 0,
      jumpDuration: 500
    };
  }

  calculateScore() {
    const currentFrame = this.frameCount;
    const scoreIncrease = Math.floor((currentFrame - this.lastScoreFrame) / GAME_CONSTANTS.SCORE_INCREASE_INTERVAL);
    
    if (scoreIncrease > 0) {
      this.lastScoreFrame = currentFrame - (currentFrame % GAME_CONSTANTS.SCORE_INCREASE_INTERVAL);
      return this.score + scoreIncrease;
    }
    
    return this.score;
  }

  updateGameSpeed(newScore) {
    if (newScore < 2000) {
      // 2000점 미만일 때는 기존 로그 함수 사용
      this.gameSpeed = this.initialSpeed + Math.min(
        GAME_CONSTANTS.MAX_SPEED_INCREASE,
        Math.log2(newScore + 1) * GAME_CONSTANTS.SPEED_INCREASE_FACTOR
      );
    } else {
      // 2000점 이상일 때는 선형적으로 증가
      const baseSpeed = this.initialSpeed + Math.log2(2000 + 1) * GAME_CONSTANTS.SPEED_INCREASE_FACTOR;
      const linearIncrease = (newScore - 2000) * 0.01; // 100점당 1씩 증가
      this.gameSpeed = baseSpeed + linearIncrease;
    }
  }

  createTree() {
    const speedFactor = Math.min(2, this.gameSpeed / this.initialSpeed);
    const minInterval = GAME_CONSTANTS.MIN_TREE_INTERVAL / speedFactor;
    const maxInterval = GAME_CONSTANTS.MAX_TREE_INTERVAL / speedFactor;
    
    const interval = minInterval + (maxInterval - minInterval) * Math.random();
    
    const newTree = {
      x: Math.round(GAME_CONSTANTS.TREE_START * this.scale),
      y: Math.round(GAME_CONSTANTS.Y_BASE * this.scale),
      width: GAME_CONSTANTS.TREE_WIDTH * this.scale,
      height: GAME_CONSTANTS.TREE_HEIGHT * this.scale,
      type: Math.floor(Math.random() * 4)
    };
    
    this.trees.push(newTree);

    if (Math.random() < GAME_CONSTANTS.DOUBLE_TREE_CHANCE) {
      const secondTree = {
        x: Math.round((GAME_CONSTANTS.TREE_START + GAME_CONSTANTS.TREE_WIDTH) * this.scale),
        y: Math.round(GAME_CONSTANTS.Y_BASE * this.scale),
        width: GAME_CONSTANTS.TREE_WIDTH * this.scale,
        height: GAME_CONSTANTS.TREE_HEIGHT * this.scale,
        type: Math.floor(Math.random() * 4)
      };
      this.trees.push(secondTree);
    }
    
    this.nextTreeTime = this.frameCount + Math.floor(interval);
  }

  updateDinoPosition() {
    if (this.dino.jumping) {
      const currentTime = Date.now();
      const jumpProgress = Math.min((currentTime - this.dino.jumpStartTime) / this.dino.jumpDuration, 1);
      
      if (jumpProgress < 1) {
        const jumpHeight = Math.round(Math.sin(jumpProgress * Math.PI) * GAME_CONSTANTS.MAX_JUMP * 20 * this.scale);
        this.dino.y = Math.round(GAME_CONSTANTS.Y_BASE * this.scale - jumpHeight);
      } else {
        this.dino.y = Math.round(GAME_CONSTANTS.Y_BASE * this.scale);
        this.dino.jumping = false;
      }
    } else {
      this.dino.y = Math.round(GAME_CONSTANTS.Y_BASE * this.scale);
    }
  }

  updateTrees() {
    const currentTime = Date.now();
    const timeDiff = currentTime - this.lastMoveTime;
    const moveDistance = (this.gameSpeed * timeDiff) / 16.67;

    this.trees.forEach(tree => {
      tree.x -= moveDistance;
    });

    this.trees = this.trees.filter(tree => tree.x > -50);
    this.lastMoveTime = currentTime;
  }

  drawBaseLine() {
    const baseLineY = Math.round(GAME_CONSTANTS.Y_BASE * this.scale + GAME_CONSTANTS.DINO_HEIGHT * this.scale);
    this.ctx.beginPath();
    this.ctx.moveTo(0, baseLineY);
    this.ctx.lineTo(this.canvas.width, baseLineY);
    this.ctx.strokeStyle = '#4eff4e';
    this.ctx.stroke();
  }
}

const MiniGame = () => {
  const canvasRef = useRef(null);
  const gameRef = useRef(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [leaderboardScores, setLeaderboardScores] = useState([]);

  const dinoSources = [dino0, dino1, dino2, dino3, dino4, dino5, dino6, dino7, dino8, dino9, dino10, dino11];
  const legoSources = [lego0, lego1, lego2, lego3];

  const dinoImages = useRef([]).current;
  const legoImages = useRef([]).current;

  const loadImages = () => {
    console.log('Starting to load images...');
    let loadedCount = 0;
    const totalImages = dinoSources.length + legoSources.length;

    const handleImageLoad = () => {
      loadedCount++;
      console.log(`Loaded ${loadedCount}/${totalImages} images`);
      if (loadedCount === totalImages) {
        console.log('All images loaded successfully');
        setImagesLoaded(true);
      }
    };

    const loadImageSet = (sources, imagesArray) => {
      sources.forEach((src, index) => {
        const img = new Image();
        img.onload = handleImageLoad;
        img.onerror = (e) => {
          console.error('Failed to load image:', src);
          handleImageLoad();
        };
        img.src = src;
        imagesArray[index] = img;
      });
    };

    loadImageSet(dinoSources, dinoImages);
    loadImageSet(legoSources, legoImages);
  };

  const drawDino = (ctx, dino) => {
    if (!imagesLoaded) return;
    
    try {
      const game = gameRef.current;
      const currentTime = Date.now();
      const timeDiff = currentTime - game.lastAnimationTime;
      const imageIndex = Math.floor((timeDiff / GAME_CONSTANTS.ANIMATION_FRAME_RATE) % 12);
      
      ctx.drawImage(
        dinoImages[imageIndex],
        dino.x,
        dino.y,
        dino.width,
        dino.height
      );
    } catch (error) {
      console.error('Error drawing dino:', error);
    }
  };

  const drawTree = (ctx, tree) => {
    if (!imagesLoaded) return;
    
    try {
      ctx.drawImage(
        legoImages[tree.type],
        tree.x,
        tree.y,
        tree.width,
        tree.height
      );
    } catch (error) {
      console.error('Error drawing tree:', error);
    }
  };

  const checkCollision = (dino, tree) => {
    const game = gameRef.current;
    const hitboxScale = game.hitboxScale;
    
    // 고정된 픽셀 값에 스케일 적용
    const dinoHitboxShrink = GAME_CONSTANTS.DINO_HITBOX_SHRINK * hitboxScale;
    const dinoWidth = GAME_CONSTANTS.BASE_HITBOX_WIDTH * hitboxScale;
    const dinoHeight = GAME_CONSTANTS.BASE_HITBOX_HEIGHT * hitboxScale;
    const treeWidth = GAME_CONSTANTS.TREE_WIDTH * hitboxScale;
    const treeHeight = GAME_CONSTANTS.TREE_HEIGHT * hitboxScale;

    // 실제 위치에서 히트박스 크기를 고려한 충돌 체크
    return (
      dino.x + dinoHitboxShrink < tree.x + treeWidth &&
      dino.x + dinoWidth - dinoHitboxShrink > tree.x &&
      dino.y + dinoHitboxShrink < tree.y + treeHeight &&
      dino.y + dinoHeight - dinoHitboxShrink > tree.y
    );
  };

  const handleJump = () => {
    if (!gameStarted) {
      setGameStarted(true);
      return;
    }

    const game = gameRef.current;
    if (!game || !game.dino || game.dino.jumping || gameOver) return;
    
    game.dino.jumping = true;
    game.dino.jumpStartTime = Date.now();
  };

  const handleAuth = (userData) => {
    console.log('Auth successful:', userData);
    setCurrentUser(userData);
    setShowAuthModal(false);
    loadLeaderboard();
  };

  const loadLeaderboard = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/leaderboard`, {
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard');
      }
      const data = await response.json();
      const mapped = data.map(item => ({
        ...item,
        score: item.highScore
      }));
      setLeaderboardScores(mapped);
    } catch (error) {
      console.error('Leaderboard load error:', error);
    }
  };

  const handleGameOver = async () => {
    setGameOver(true);
    const finalScore = gameRef.current.score;

    if (currentUser && finalScore > 0) {
      try {
        console.log('Saving score for user:', currentUser);
        
        const response = await fetch(`${API_BASE_URL}/api/scores`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          credentials: 'include',
          mode: 'cors',
          body: JSON.stringify({
            nickname: currentUser.nickname,
            studentId: currentUser.studentId,
            score: finalScore
          })
        });

        const data = await response.json();
        console.log('Score save response:', data);

        if (!response.ok) {
          throw new Error(data.message || '점수 저장 중 오류가 발생했습니다.');
        }

        if (data.newHighScore) {
          alert(`새로운 최고 점수를 달성했습니다! (이전 기록: ${data.previousScore}점)`);
        }
        
        loadLeaderboard();
      } catch (error) {
        console.error('Score save error:', error);
        alert(error.message || '점수 저장에 실패했습니다.');
      }
    } else {
      console.log('No user logged in or invalid score, score not saved');
    }
  };

  const gameLoop = () => {
    const game = gameRef.current;
    if (!game || gameOver || !imagesLoaded) return;

    const { ctx, dino } = game;
    
    game.frameCount++;

    const newScore = game.calculateScore();
    if (newScore !== game.score) {
      game.score = newScore;
      setScore(newScore);
      game.updateGameSpeed(newScore);
    }

    ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, game.canvas.width, game.canvas.height);

    game.drawBaseLine();
    game.updateDinoPosition();
    game.updateTrees();

    if (game.frameCount >= game.nextTreeTime) {
      game.createTree();
    }

    game.trees.forEach(tree => {
      drawTree(ctx, tree);
    });

    drawDino(ctx, dino);

    for (const tree of game.trees) {
      if (checkCollision(dino, tree)) {
        handleGameOver();
        return;
      }
    }

    requestAnimationFrame(gameLoop);
  };

  const initGame = () => {
    console.log('Initializing game...');
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error('Canvas not found');
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Could not get canvas context');
      return;
    }

    gameRef.current = new GameState(canvas);
    loadImages();
  };

  const handleRestart = (e) => {
    e.stopPropagation();
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
    initGame();
    loadLeaderboard();
  };

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const container = canvas.parentElement;
    const containerWidth = container.clientWidth;
    const aspectRatio = 800 / 300;
    const minHeight = 200;
    const maxWidth = 800;

    let canvasWidth = Math.min(maxWidth, containerWidth * 0.9);
    let canvasHeight = canvasWidth / aspectRatio;

    // 만약 높이가 너무 작으면, height를 기준으로 다시 계산
    if (canvasHeight < minHeight) {
      canvasHeight = minHeight;
      canvasWidth = canvasHeight * aspectRatio;
    }

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    if (gameRef.current) {
      const scale = Math.min(Math.max(canvasWidth / 800, GAME_CONSTANTS.MIN_SCALE), GAME_CONSTANTS.MAX_SCALE);
      gameRef.current = new GameState(canvas);
      gameRef.current.hitboxScale = scale;
      
      if (gameStarted) {
        gameRef.current.gameSpeed = gameRef.current.initialSpeed;
      }
    }
  };

  const handleTouchStart = (e) => {
    handleJump();
  };

  useEffect(() => {
    initGame();
  }, []);

  useEffect(() => {
    if (gameStarted && !gameOver && imagesLoaded) {
      gameLoop();
    }
  }, [gameStarted, gameOver, imagesLoaded]);

  useEffect(() => {
    resizeCanvas();

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('orientationchange', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('orientationchange', resizeCanvas);
    };
  }, []);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  useEffect(() => {
    document.body.style.backgroundColor = '#000';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflow = 'auto';

    return () => {
      document.body.style.backgroundColor = '';
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <GameContainer 
      onClick={handleJump}
      onTouchStart={handleTouchStart}
      onTouchMove={(e) => e.stopPropagation()}
      style={{ margin: 0, padding: 0 }}
    >
      <ScoreDisplay>Score: {score}</ScoreDisplay>
      {!imagesLoaded && <div>Loading images...</div>}
      <GameBoxWrapper>
        <GameCanvas
          ref={canvasRef}
          width={800}
          height={300}
        />
        <Leaderboard scores={leaderboardScores} />
      </GameBoxWrapper>
      <GameOver show={gameOver}>
        <h2>Game Over!</h2>
        <p>Final Score: {score}</p>
        {!currentUser && (
          <LoginNotice>
            로그인하면 점수가 저장됩니다!
          </LoginNotice>
        )}
        <RestartButton onClick={handleRestart}>
          Restart
        </RestartButton>
      </GameOver>
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onAuth={handleAuth}
        />
      )}
    </GameContainer>
  );
};

export default MiniGame; 