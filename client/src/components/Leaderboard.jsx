import React from 'react';
import styled from 'styled-components';

const LeaderboardContainer = styled.div`
  background-color: rgba(0, 0, 0, 0.8);
  border: 2px solid #4eff4e;
  border-radius: 8px;
  padding: 15px;
  color: #4eff4e;
  width: 91%;
  margin-top: 20px;
  box-sizing: border-box;
  overflow-y: auto;
`;

const Title = styled.h3`
  text-align: center;
  margin-bottom: 15px;
  font-size: 18px;
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
`;

const Rank = styled.span`
  font-weight: bold;
  width: 30px;
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

const Leaderboard = ({ scores }) => {
  return (
    <LeaderboardContainer>
      <Title>Leaderboard 🏆</Title>
      <ScoreList>
        {scores.map((score, index) => (
          <ScoreItem key={index}>
            <Rank>{index + 1}</Rank>
            <Nickname>{score.nickname}</Nickname>
            <Score>{score.score}</Score>
          </ScoreItem>
        ))}
      </ScoreList>
    </LeaderboardContainer>
  );
};

export default Leaderboard; 