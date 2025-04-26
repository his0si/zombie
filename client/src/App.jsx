import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled, { createGlobalStyle } from 'styled-components'
import questions from './data/questions'

const GlobalStyle = createGlobalStyle`
  html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100vh;
    overflow: hidden;
  }
  body {
    margin: 0;
    padding: 0;
    background-color: #000;
  }
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #000;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
`;

const ProgressContainer = styled.div`
  width: 100%;
  height: 10px;
  background-color: #222;
  border-radius: 5px;
  margin-bottom: 2rem;
  overflow: hidden;
`;

const ProgressBar = styled.div`
  width: ${props => props.$progress}%;
  height: 100%;
  background-color: #4eff4e;
  box-shadow: 0 0 10px rgba(78, 255, 78, 0.5);
  transition: width 0.3s ease-in-out;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  margin-bottom: 2rem;
  text-align: center;
  color: white;
`;

const Options = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const OptionButton = styled.button`
  padding: 1rem;
  font-size: 1rem;
  background-color: transparent;
  color: #4eff4e;
  border: 1px solid #4eff4e;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 0 10px rgba(78, 255, 78, 0.3);
  text-shadow: 0 0 5px rgba(78, 255, 78, 0.5);

  &:hover {
    background-color: #4eff4e;
    color: black;
    box-shadow: 0 0 20px rgba(78, 255, 78, 0.6);
  }
`;

function App() {
  const navigate = useNavigate()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [scores, setScores] = useState({
    남동진: 0,
    이유리: 0,
    김준호: 0,
    정예슬: 0,
    정동석: 0,
    곽준형: 0,
    고나래: 0
  })

  const handleAnswer = (optionScores) => {
    const newScores = { ...scores }
    
    // 선택한 답변의 점수를 각 캐릭터에 더함
    Object.entries(optionScores).forEach(([character, score]) => {
      newScores[character] = (newScores[character] || 0) + score
    })

    // 점수 업데이트
    setScores(newScores)

    // 마지막 질문이면 결과 페이지로 이동
    if (currentQuestion === questions.length - 1) {
      // 점수를 세션 스토리지에 저장
      sessionStorage.setItem('testScores', JSON.stringify(newScores))
      navigate('/result')
    } else {
      // 다음 질문으로 이동
      setCurrentQuestion(prev => prev + 1)
    }
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100
  const question = questions[currentQuestion]

  return (
    <>
      <GlobalStyle />
      <Container>
        <ProgressContainer>
          <ProgressBar 
            $progress={progress}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin="0"
            aria-valuemax="100"
          />
        </ProgressContainer>
        <Title>{question.question}</Title>
        <Options>
          {question.options.map((option, index) => (
            <OptionButton
              key={index}
              onClick={() => handleAnswer(option.scores)}
            >
              {option.text}
            </OptionButton>
          ))}
        </Options>
      </Container>
    </>
  )
}

export default App
