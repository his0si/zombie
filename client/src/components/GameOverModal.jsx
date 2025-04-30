import React from 'react';
import styled from 'styled-components';

const Modal = styled.div`
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
  z-index: 1000;
  pointer-events: auto;

  h2 {
    font-size: clamp(18px, 4vw, 24px);
    margin-bottom: 10px;
  }

  p {
    font-size: clamp(14px, 3vw, 18px);
    margin-bottom: 15px;
  }

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

const ModalWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
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

const GameOverModal = ({ show, score, currentUser, onRestart }) => {
  return (
    <ModalWrapper>
      <Modal show={show}>
        <h2>Game Over!</h2>
        <p>Final Score: {score}</p>
        {!currentUser && (
          <LoginNotice>
            로그인하면 점수가 저장됩니다!
          </LoginNotice>
        )}
        <RestartButton onClick={onRestart}>
          Restart
        </RestartButton>
      </Modal>
    </ModalWrapper>
  );
};

export default GameOverModal; 