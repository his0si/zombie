const express = require('express');
const router = express.Router();
const User = require('../models/User');

// 통합된 인증 처리
router.post('/', async (req, res) => {
  try {
    console.log('Received auth request:', req.body);
    const { nickname, studentId } = req.body;
    
    if (!nickname || !studentId) {
      return res.status(400).json({ message: '닉네임과 학번을 모두 입력해주세요.' });
    }

    // 학번으로 사용자 검색
    let user = await User.findOne({ student_id: studentId });
    
    if (user) {
      // 기존 사용자인 경우 닉네임 확인
      if (user.nickname !== nickname) {
        return res.status(400).json({ 
          success: false,
          message: '학번에 등록된 닉네임이 다릅니다.'
        });
      }
    } else {
      // 새 사용자인 경우 닉네임 중복 체크
      const existingNickname = await User.findOne({ nickname });
      if (existingNickname) {
        return res.status(400).json({
          success: false,
          message: '이미 사용 중인 닉네임입니다.'
        });
      }
      
      // 새 사용자 생성
      user = new User({
        nickname,
        student_id: studentId
      });
      await user.save();
    }
    
    // 인증 성공
    return res.status(200).json({
      success: true,
      user: {
        nickname: user.nickname,
        studentId: user.student_id
      }
    });
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

module.exports = router; 