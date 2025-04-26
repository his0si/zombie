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
  margin-bottom: 20px;
  font-size: 24px;
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

const SwitchText = styled.p`
  text-align: center;
  margin-top: 15px;
  cursor: pointer;
  color: #4eff4e80;

  &:hover {
    color: #4eff4e;
  }
`;

const AuthModal = ({ onClose, onAuth }) => {
  const [isLogin, setIsLogin] = useState(false);
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
      console.log('Sending request to:', apiUrl); // 디버깅용 로그

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
        <Title>{isLogin ? '로그인' : '회원가입'}</Title>
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
            {isLogin ? '로그인' : '회원가입'}
          </Button>
        </Form>
        <SwitchText onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? '회원가입하기' : '로그인하기'}
        </SwitchText>
      </ModalContent>
    </ModalOverlay>
  );
};

const ErrorMessage = styled.div`
  color: #ff4e4e;
  margin-bottom: 15px;
  text-align: center;
  font-size: 14px;
`;

export default AuthModal; 