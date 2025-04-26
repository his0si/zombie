import { useNavigate, useParams } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import results, { getResult } from '../data/results';
import Footer from '../components/Footer';

const GlobalStyle = createGlobalStyle`
  html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    overflow-x: hidden;
  }
  body {
    margin: 0;
    padding: 0;
    background-color: #000;
    min-height: 100vh;
  }
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
  background-color: #000;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #4eff4e;
  text-shadow: 0 0 10px rgba(78, 255, 78, 0.5);
`;

const Emoji = styled.div`
  font-size: 4rem;
  margin: 1rem 0;
`;

const CharacterImage = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 10px;
  margin: 1.5rem auto;
  object-fit: cover;
  border: 2px solid #4eff4e;
  box-shadow: 0 0 15px rgba(78, 255, 78, 0.3);
`;

const Description = styled.p`
  font-size: 1.2rem;
  line-height: 1.6;
  color: #4eff4e;
  margin: 1.5rem auto;
  max-width: 600px;
  text-shadow: 0 0 5px rgba(78, 255, 78, 0.3);
`;

const CompatibilitySection = styled.div`
  margin: 2rem auto;
  padding: 1.5rem;
  background-color: rgba(78, 255, 78, 0.1);
  border: 1px solid #4eff4e;
  border-radius: 10px;
  max-width: 600px;
  box-shadow: 0 0 15px rgba(78, 255, 78, 0.2);
`;

const CompatibilityTitle = styled.h2`
  font-size: 1.8rem;
  color: #4eff4e;
  margin-bottom: 1.5rem;
  text-shadow: 0 0 8px rgba(78, 255, 78, 0.3);
`;

const CompatibilityItem = styled.div`
  margin: 1.5rem 0;
  color: #4eff4e;
  
  strong {
    display: block;
    font-size: 1.3rem;
    color: #4eff4e;
    margin-bottom: 0.5rem;
    text-shadow: 0 0 5px rgba(78, 255, 78, 0.3);
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
  flex-wrap: wrap;
`;

const Button = styled.button`
  padding: 0.8rem 1.5rem;
  font-size: 1.1rem;
  width: 160px;
  border: 2px solid #4eff4e;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ShareButton = styled(Button)`
  background-color: #4eff4e;
  color: #000;
  box-shadow: 0 0 10px rgba(78, 255, 78, 0.3);
  font-size: 0.95rem;
  
  &:hover {
    background-color: transparent;
    color: #4eff4e;
    box-shadow: 0 0 20px rgba(78, 255, 78, 0.5);
    transform: translateY(-2px);
  }
`;

const ResetButton = styled(Button)`
  background-color: transparent;
  color: #4eff4e;
  box-shadow: 0 0 10px rgba(78, 255, 78, 0.3);
  font-size: 0.95rem;
  
  &:hover {
    background-color: #4eff4e;
    color: #000;
    box-shadow: 0 0 20px rgba(78, 255, 78, 0.5);
    transform: translateY(-2px);
  }
`;

export default function Result() {
  const navigate = useNavigate();
  const { character } = useParams();
  
  let result;
  if (character && results[character]) {
    result = results[character];
  } else {
    const scores = JSON.parse(sessionStorage.getItem('testScores'));
    console.log('Retrieved scores from session storage:', scores);
    
    if (!scores) {
      console.log('No scores found in session storage, redirecting to home');
      navigate('/', { replace: true });
      return null;
    }

    result = getResult(scores);
    console.log('Calculated result:', result);
  }

  return (
    <>
      <GlobalStyle />
      <Container>
        <Title>{result.name}</Title>
        <Emoji>{result.emoji}</Emoji>
        <CharacterImage src={result.image} alt={result.name} />
        <Description>{result.description}</Description>
        
        <CompatibilitySection>
          <CompatibilityTitle>찰떡 궁합</CompatibilityTitle>
          <CompatibilityItem>
            <strong>{result.compatibility.primary}</strong>
            {result.compatibility.primaryReason}
          </CompatibilityItem>
          <CompatibilityItem>
            <strong>{result.compatibility.secondary}</strong>
            {result.compatibility.secondaryReason}
          </CompatibilityItem>
        </CompatibilitySection>

        <ButtonContainer>
          <ShareButton onClick={async () => {
            const shareUrl = character 
              ? window.location.href 
              : `${window.location.origin}/result/${result.name}`;

            try {
              await navigator.clipboard.writeText(shareUrl);

              if (navigator.share) {
                await navigator.share({
                  title: `좀비고등학교 성격 테스트 결과: ${result.name}`,
                  text: `나는 ${result.name}!\n${result.description}`,
                  url: shareUrl,
                });
              }
            } catch (err) {
              console.error('공유/복사 실패:', err);
              
              try {
                const tempInput = document.createElement('input');
                tempInput.style.position = 'absolute';
                tempInput.style.left = '-9999px';
                document.body.appendChild(tempInput);
                tempInput.value = shareUrl;
                tempInput.select();
                document.execCommand('copy');
                document.body.removeChild(tempInput);
              } catch (err) {
                console.error('클립보드 복사 실패:', err);
                alert('클립보드 복사가 지원되지 않는 환경입니다.');
              }
            }
          }}>
            결과 공유하기
          </ShareButton>

          <ResetButton onClick={() => {
            sessionStorage.removeItem('testScores');
            navigate('/');
          }}>
            테스트 다시하기
          </ResetButton>
        </ButtonContainer>
      </Container>
      <Footer />
    </>
  );
}
