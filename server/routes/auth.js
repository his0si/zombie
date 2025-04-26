const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Login or Register
router.post('/', async (req, res) => {
  try {
    console.log('Received auth request:', req.body);  // 디버깅용 로그
    const { nickname, studentId } = req.body;
    
    if (!nickname || !studentId) {
      return res.status(400).json({ message: '닉네임과 학번을 모두 입력해주세요.' });
    }

    let user = await User.findOne({ student_id: studentId });
    
    if (user) {
      // 로그인 로직
      if (user.nickname !== nickname) {
        return res.status(400).json({ message: '학번에 등록된 닉네임이 다릅니다.' });
      }
    } else {
      // 회원가입 로직
      user = new User({
        nickname,
        student_id: studentId
      });
      await user.save();
    }
    
    res.status(200).json({
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