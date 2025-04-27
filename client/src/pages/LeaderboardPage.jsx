import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const Container = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  width: 100vw;
  height: 100vh;
  background: #000;
  margin: 0;
  padding: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h1`
  font-size: clamp(24px, 5vw, 32px);
  color: #4eff4e;
  text-shadow: 0 0 10px rgba(78, 255, 78, 0.5);
`;

const BackButton = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  padding: clamp(6px, 2vw, 10px) clamp(12px, 3vw, 20px);
  background-color: transparent;
  color: #4eff4e;
  border: 2px solid #4eff4e;
  border-radius: 5px;
  cursor: pointer;
  font-size: clamp(12px, 3vw, 16px);
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #4eff4e;
    color: #000;
  }
`;

const LeaderboardContainer = styled.div`
  background-color: #000;
  border: 2px solid #4eff4e;
  border-radius: 8px;
  padding: 15px;
  color: #4eff4e;
  width: 91%;
  max-width: 600px;
  margin: 0 auto 20px auto;
  box-sizing: border-box;
  overflow-y: auto;
  position: relative;
`;

const LimitNotice = styled.p`
  text-align: center;
  color: #ffffff;
  font-size: 12px;
  margin-bottom: 15px;
`;

const ScoreList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ScoreItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
  border-bottom: 1px solid #4eff4e40;
  font-size: ${props => props.rank > 3 ? '0.9em' : '1em'};
  opacity: ${props => props.rank > 3 ? '0.8' : '1'};
  color: #4eff4e;
`;

const Rank = styled.span`
  font-weight: bold;
  width: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  ${props => props.rank > 3 && 'margin-left: 0px;'}
`;

const Nickname = styled.span`
  flex: 1;
  text-align: left;
  margin: 0 10px;
`;

const Score = styled.span`
  font-weight: bold;
  width: 60px;
  text-align: right;
`;

const LeaderboardPage = () => {
  const [scores, setScores] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.backgroundColor = '#000';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.backgroundColor = '';
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.body.style.overflow = '';
    };
  }, []);

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
      setScores(mapped);
    } catch (error) {
      console.error('Leaderboard load error:', error);
    }
  };

  useEffect(() => {
    loadLeaderboard();
  }, []);

  return (
    <Container>
      <BackButton onClick={() => navigate('/mini-game')}>
        ← Back to Game
      </BackButton>
      <Title>Leaderboard 🏆</Title>
      <LeaderboardContainer>
        <LimitNotice>리더보드에는 상위 10명까지만 표시됩니다</LimitNotice>
        <ScoreList>
          {scores.map((score, index) => {
            let rankDisplay;
            if (index === 0) rankDisplay = '🥇';
            else if (index === 1) rankDisplay = '🥈';
            else if (index === 2) rankDisplay = '🥉';
            else rankDisplay = index + 1;
            return (
              <ScoreItem key={index} rank={index + 1}>
                <Rank rank={index + 1}>{rankDisplay}</Rank>
                <Nickname>{score.nickname}</Nickname>
                <Score>{score.score}</Score>
              </ScoreItem>
            );
          })}
        </ScoreList>
      </LeaderboardContainer>
    </Container>
  );
};

export default LeaderboardPage; 