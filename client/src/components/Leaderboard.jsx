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
  margin-bottom: 40px;
  box-sizing: border-box;
  overflow-y: auto;
`;

const Title = styled.h3`
  text-align: center;
  margin-bottom: 15px;
  font-size: 18px;
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

const Leaderboard = ({ scores }) => {
  return (
    <LeaderboardContainer>
      <Title>Leaderboard 🏆</Title>
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
  );
};

export default Leaderboard; 