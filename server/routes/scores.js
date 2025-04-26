const express = require('express');
const router = express.Router();
const Score = require('../models/Score');
const User = require('../models/User');

// Save new score
router.post('/', async (req, res) => {
  try {
    const { nickname, studentId, score } = req.body;
    
    const user = await User.findOne({ student_id: studentId });
    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    // Get user's previous high score
    const previousHighScore = await Score.findOne({ user: user._id })
      .sort({ score: -1 });

    const newScore = await Score.create({
      user: user._id,
      score
    });

    res.json({
      score: newScore,
      newHighScore: !previousHighScore || score > previousHighScore.score,
      previousScore: previousHighScore ? previousHighScore.score : 0
    });
  } catch (error) {
    console.error('Score save error:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

module.exports = router; 