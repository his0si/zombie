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
const CONSTANTS = {
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
  MIN_TREE_INTERVAL: 30,  // 최소 프레임 간격
  MAX_TREE_INTERVAL: 120  // 최대 프레임 간격
};

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
console.log('API_BASE_URL:', API_BASE_URL); // 디버깅용 로그 추가

const GameContainer = styled.div`
  width: calc(var(--vw, 1vw) * 100);
  height: calc(var(--vh, 1vh) * 100);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #000;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  cursor: pointer;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
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
  margin: 10px 0;
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
    this.lastScoreFrame = 0;  // 마지막으로 점수를 증가시킨 프레임
    
    const scale = canvas.width / 800;
    
    this.dino = {
      x: 50 * scale,
      y: CONSTANTS.Y_BASE * scale,
      width: CONSTANTS.DINO_WIDTH * scale,
      height: CONSTANTS.DINO_HEIGHT * scale,
      jumping: false,
      jumpStartTime: 0,
      jumpDuration: 500
    };
    
    this.trees = [];
    this.scale = scale;
    this.isCollision = false;
  }

  // 점수 계산 메서드 추가
  calculateScore() {
    const currentFrame = this.frameCount;
    const scoreIncrease = Math.floor((currentFrame - this.lastScoreFrame) / 6);
    
    if (scoreIncrease > 0) {
      this.lastScoreFrame = currentFrame - (currentFrame % 6);
      return this.score + scoreIncrease;
    }
    
    return this.score;
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
  const legoSources = [lego0, lego1, lego2, lego3];  // cactus 대신 lego 이미지 사용

  const dinoImages = useRef([]).current;
  const legoImages = useRef([]).current;  // cactus 대신 lego 이미지 사용

  const loadImages = () => {
    console.log('Starting to load images...');
    let loadedCount = 0;
    const totalImages = dinoSources.length + legoSources.length;  // cactus 대신 lego 이미지 사용

    const handleImageLoad = () => {
      loadedCount++;
      console.log(`Loaded ${loadedCount}/${totalImages} images`);
      if (loadedCount === totalImages) {
        console.log('All images loaded successfully');
        setImagesLoaded(true);
      }
    };

    // 공룡 이미지 로드
    dinoSources.forEach((src, index) => {
      const img = new Image();
      img.onload = handleImageLoad;
      img.onerror = (e) => {
        console.error('Failed to load image:', src);
        handleImageLoad();
      };
      img.src = src;
      dinoImages[index] = img;
    });

    // 레고 이미지 로드
    legoSources.forEach((src, index) => {
      const img = new Image();
      img.onload = handleImageLoad;
      img.onerror = (e) => {
        console.error('Failed to load image:', src);
        handleImageLoad();
      };
      img.src = src;
      legoImages[index] = img;
    });
  };

  // 공룡 그리기 함수
  const drawDino = (ctx, dino) => {
    if (!imagesLoaded) return;
    
    try {
      const game = gameRef.current;
      const currentTime = Date.now();
      const timeDiff = currentTime - game.lastAnimationTime;
      
      // 166.67ms마다 이미지 변경 (약 6번/초)
      const imageIndex = Math.floor((timeDiff / 166.67) % 12);
      
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

  // 나무 그리기 함수
  const drawTree = (ctx, tree) => {
    if (!imagesLoaded) return;
    
    try {
      ctx.drawImage(
        legoImages[tree.type],  // cactus 대신 lego 이미지 사용
        tree.x,
        tree.y,
        tree.width,
        tree.height
      );
    } catch (error) {
      console.error('Error drawing tree:', error);
    }
  };

  // 점수 업데이트 함수
  const updateScore = (game) => {
    if (game.frameCount % 6 === 0) {
      setScore(prev => prev + 1);
      game.score = score + 1;
      
      // 점수에 따른 게임 속도 증가 - 지수적으로 증가
      if (game.score % 30 === 0) {  // 더 자주 속도 증가
        const speedIncrease = 0.2 + (game.score / 1000);  // 점수가 높을수록 더 많이 증가
        game.gameSpeed += speedIncrease;
      }
    }
  };

  // 충돌 체크 함수
  const checkCollision = (dino, tree) => {
    return (
      dino.x < tree.x + tree.width &&
      dino.x + dino.width > tree.x &&
      dino.y < tree.y + tree.height &&
      dino.y + dino.height > tree.y
    );
  };

  // 점프 처리 함수
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

  // Auth 핸들러 수정
  const handleAuth = (userData) => {
    console.log('Auth successful:', userData);
    setCurrentUser(userData);
    setShowAuthModal(false);
    // 리더보드 데이터 다시 로드
    loadLeaderboard();
  };

  // 리더보드 데이터 로드
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
      // highScore를 score로 변환
      const mapped = data.map(item => ({
        ...item,
        score: item.highScore
      }));
      setLeaderboardScores(mapped);
    } catch (error) {
      console.error('Leaderboard load error:', error);
    }
  };

  // 게임 오버 처리 수정
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
        
        // 리더보드 업데이트
        loadLeaderboard();
      } catch (error) {
        console.error('Score save error:', error);
        alert(error.message || '점수 저장에 실패했습니다.');
      }
    } else {
      console.log('No user logged in or invalid score, score not saved');
    }
  };

  // 게임 루프 함수
  const gameLoop = () => {
    const game = gameRef.current;
    if (!game || gameOver || !imagesLoaded) return;

    const { ctx, dino } = game;
    
    // 프레임 카운터 업데이트
    game.frameCount++;

    // 점수 업데이트 - 6프레임마다 1점씩 증가
    const newScore = game.calculateScore();
    if (newScore !== game.score) {
      game.score = newScore;
      setScore(newScore);

      // 점수에 따른 게임 속도 증가
      if (newScore % 30 === 0) {
        const speedIncrease = 0.2 + (newScore / 1000);
        game.gameSpeed += speedIncrease;
      }
    }

    // 나머지 게임 로직...
    ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, game.canvas.width, game.canvas.height);

    // 바닥 선 그리기
    const baseLineY = Math.round(CONSTANTS.Y_BASE * game.scale + CONSTANTS.DINO_HEIGHT * game.scale);
    ctx.beginPath();
    ctx.moveTo(0, baseLineY);
    ctx.lineTo(game.canvas.width, baseLineY);
    ctx.strokeStyle = '#4eff4e';
    ctx.stroke();

    // 점프 로직
    if (dino.jumping) {
      const currentTime = Date.now();
      const jumpProgress = Math.min((currentTime - dino.jumpStartTime) / dino.jumpDuration, 1);
      
      if (jumpProgress < 1) {
        const jumpHeight = Math.round(Math.sin(jumpProgress * Math.PI) * CONSTANTS.MAX_JUMP * 20 * game.scale);
        dino.y = Math.round(CONSTANTS.Y_BASE * game.scale - jumpHeight);
      } else {
        dino.y = Math.round(CONSTANTS.Y_BASE * game.scale);
        dino.jumping = false;
      }
    } else {
      dino.y = Math.round(CONSTANTS.Y_BASE * game.scale);
    }

    // 시간 기반 이동 속도 계산
    const currentTime = Date.now();
    const timeDiff = currentTime - game.lastMoveTime;
    const moveDistance = (game.gameSpeed * timeDiff) / 16.67;  // 16.67ms는 약 60FPS의 한 프레임 시간

    // 나무 이동
    game.trees.forEach(tree => {
      tree.x -= moveDistance;
    });

    // 화면을 벗어난 나무 제거
    game.trees = game.trees.filter(tree => tree.x > -50);

    // 나무 생성 로직
    if (game.frameCount >= game.nextTreeTime) {
      const speedFactor = Math.min(2, game.gameSpeed / game.initialSpeed);
      const minInterval = CONSTANTS.MIN_TREE_INTERVAL / speedFactor;
      const maxInterval = CONSTANTS.MAX_TREE_INTERVAL / speedFactor;
      
      const interval = minInterval + (maxInterval - minInterval) * Math.random();
      
      const newTree = {
        x: Math.round(CONSTANTS.TREE_START * game.scale),
        y: Math.round(CONSTANTS.Y_BASE * game.scale),
        width: CONSTANTS.TREE_WIDTH * game.scale,
        height: CONSTANTS.TREE_HEIGHT * game.scale,
        type: Math.floor(Math.random() * 4)  // 레고 이미지 4개 중 랜덤 선택
      };
      
      game.trees.push(newTree);

      // 30% 확률로 두 번째 나무 생성
      if (Math.random() < 0.3) {
        const secondTree = {
          x: Math.round((CONSTANTS.TREE_START + CONSTANTS.TREE_WIDTH) * game.scale),
          y: Math.round(CONSTANTS.Y_BASE * game.scale),
          width: CONSTANTS.TREE_WIDTH * game.scale,
          height: CONSTANTS.TREE_HEIGHT * game.scale,
          type: Math.floor(Math.random() * 4)
        };
        game.trees.push(secondTree);
      }
      
      game.nextTreeTime = game.frameCount + Math.floor(interval);
    }

    // 나무 그리기
    game.trees.forEach(tree => {
      drawTree(ctx, tree);
    });

    // 공룡 그리기
    drawDino(ctx, dino);

    // 충돌 체크
    for (const tree of game.trees) {
      if (checkCollision(dino, tree)) {
        handleGameOver();
        return;
      }
    }

    // 마지막 이동 시간 업데이트
    game.lastMoveTime = currentTime;

    requestAnimationFrame(gameLoop);
  };

  // 게임 초기화 함수
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

  // 게임 재시작 함수 수정
  const handleRestart = (e) => {
    e.stopPropagation();
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
    initGame();
    // 리더보드 업데이트
    loadLeaderboard();
  };

  // 캔버스 크기 조정 함수
  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const container = canvas.parentElement;
    const containerWidth = container.clientWidth;
    
    // 모바일에서는 화면 너비의 90%를 사용
    const canvasWidth = Math.min(800, containerWidth * 0.9);
    const canvasHeight = (canvasWidth * 300) / 800; // 비율 유지

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // 게임 상태 업데이트
    if (gameRef.current) {
      const scale = canvasWidth / 800;
      
      // 게임 상태 재초기화
      gameRef.current = new GameState(canvas);
      
      // 게임 시작 상태 유지
      if (gameStarted) {
        gameRef.current.gameSpeed = gameRef.current.initialSpeed;
      }
    }
  };

  // 터치 이벤트 핸들러
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
    // 초기 캔버스 크기 설정
    resizeCanvas();

    // 리사이즈 이벤트 리스너
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('orientationchange', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('orientationchange', resizeCanvas);
    };
  }, []);

  // 컴포넌트 마운트시 리더보드 로드
  useEffect(() => {
    loadLeaderboard();
  }, []);

  return (
    <GameContainer 
      onClick={handleJump}
      onTouchStart={handleTouchStart}
      onTouchMove={(e) => e.stopPropagation()}
    >
      <ScoreDisplay>Score: {score}</ScoreDisplay>
      {!imagesLoaded && <div>Loading images...</div>}
      <GameCanvas
        ref={canvasRef}
        width={800}
        height={300}
      />
      <GameOver show={gameOver}>
        <h2>Game Over!</h2>
        <p>Final Score: {score}</p>
        {!currentUser && (
          <p style={{ color: '#ff4e4e', fontSize: '14px', marginBottom: '10px' }}>
            로그인하면 점수가 저장됩니다!
          </p>
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
      <Leaderboard scores={leaderboardScores} />
    </GameContainer>
  );
};

export default MiniGame; 