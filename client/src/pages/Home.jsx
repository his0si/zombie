import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ZombieImage from '../assets/zombie.png';

const Container = styled.div`
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
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 380px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  padding: 0 20px;
`;

const Title = styled.h1`
  color: white;
  font-size: clamp(24px, 6vw, 32px);
  margin: 0;
  white-space: nowrap;
  width: 100%;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5em;
`;

const Description = styled.p`
  color: white;
  font-size: clamp(14px, 4vw, 18px);
  margin: 0;
  text-align: center;
`;

const StartButton = styled.button`
  padding: 0.8rem 2rem;
  font-size: 0.85rem;
  background-color: transparent;
  color: #4eff4e;
  border: 1px solid #4eff4e;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 0 10px rgba(78, 255, 78, 0.3);
  text-shadow: 0 0 5px rgba(78, 255, 78, 0.5);
  font-weight: bold;
  width: 160px;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background-color: #4eff4e;
    color: black;
    box-shadow: 0 0 20px rgba(78, 255, 78, 0.6);
  }
`;

const ImageButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }

  img {
    width: 100px;
    height: auto;
  }
`;

export default function Home() {
  const navigate = useNavigate();

  return (
    <Container>
      <ContentWrapper>
        <Title>
          좀비고 학생 유형 테스트
          <img
            src={ZombieImage}
            alt="Zombie"
            style={{ height: '1em', marginLeft: '0', verticalAlign: 'middle', cursor: 'pointer' }}
            onClick={() => navigate('/mini-game')}
          />
        </Title>
        <Description>당신은 어떤 좀비고 학생일까요?</Description>
        <StartButton onClick={() => navigate('/test')}>
          테스트 시작하기
        </StartButton>
      </ContentWrapper>
      {/* <ImageButton onClick={() => navigate('/mini-game')}>
        <img src={ZombieImage} alt="Zombie" />
      </ImageButton> */}
    </Container>
  );
}
