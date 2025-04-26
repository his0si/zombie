import React, { useState } from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: #000;
  padding: 20px;
  border-radius: 8px;
  border: 2px solid #4eff4e;
  width: 90%;
  max-width: 400px;
  color: #4eff4e;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 10px;
  font-size: 24px;
`;

const Description = styled.p`
  text-align: center;
  margin-bottom: 20px;
  font-size: 14px;
  color: #ffffff;
  line-height: 1.5;
`;

const LandscapeMessage = styled.p`
  text-align: center;
  margin-bottom: 20px;
  font-size: 12px;
  color: #4eff4ecc;
  line-height: 1.4;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #4eff4e;
  background-color: #000;
  color: #4eff4e;
  border-radius: 4px;
  font-size: 16px;

  &::placeholder {
    color: #4eff4e80;
  }
`;

const Button = styled.button`
  padding: 10px;
  background-color: #4eff4e;
  color: #000;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background-color: #45ff45;
  }
`;

const ErrorMessage = styled.div`
  color: #ff4e4e;
  margin-bottom: 15px;
  text-align: center;
  font-size: 14px;
`;

const TextButton = styled.button`
  background: none;
  border: none;
  color: #4eff4ecc;
  font-size: 13px;
  margin-top: 10px;
  cursor: pointer;
  padding: 0;
  text-align: center;
  display: block;
  width: 100%;
  font-weight: normal;
  transition: text-decoration 0.2s;
  &:hover {
    text-decoration: underline;
  }
`;

const AuthModal = ({ onClose, onAuth }) => {
  const [nickname, setNickname] = useState('');
  const [studentId, setStudentId] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!nickname || !studentId) {
      setError('닉네임과 학번을 모두 입력해주세요.');
      return;
    }

    try {
      const apiUrl = `${import.meta.env.VITE_API_URL}/api/auth`;
      console.log('Sending request to:', apiUrl);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        mode: 'cors',
        body: JSON.stringify({
          nickname: nickname.trim(),
          studentId: studentId.trim()
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || '인증 처리 중 오류가 발생했습니다.');
      }

      if (data.success) {
        onAuth(data.user);
        onClose();
      } else {
        setError(data.message || '인증에 실패했습니다.');
      }
    } catch (error) {
      console.error('Auth error:', error);
      setError(error.message || '서버 연결에 실패했습니다.');
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <Title>이스터에그 발견!🎉</Title>
        <Description>
          닉네임과 학번을 입력하고<br />
          이화좀비대학교의 특별한 게임에 도전해 보세요!<br />
          <br />
          닉네임은 리더보드에 순위를 표시하기 위해 필요하며, <br />
          학번은 순위권 경품 수령 시 본인 확인 용도로만 사용됩니다.
        </Description>
        <LandscapeMessage>
          세로 화면에서는 게임 화면이 제한되어 원활한 플레이가 어려울 수 있습니다.<br />
          더 나은 몰입감을 위해 가로 모드 사용을 권장합니다.
        </LandscapeMessage>
        {error && (
          <ErrorMessage>{error}</ErrorMessage>
        )}
        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="닉네임"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            required
          />
          <Input
            type="text"
            placeholder="학번"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            required
          />
          <Button type="submit">
            시작하기
          </Button>
        </Form>
        <TextButton
          type="button"
          onClick={() => { onAuth(null); onClose(); }}
        >
          입력 없이 바로 시작
        </TextButton>
      </ModalContent>
    </ModalOverlay>
  );
};

export default AuthModal; 