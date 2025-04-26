const express = require('express');
const router = express.Router();
const Score = require('../models/Score');

// Get leaderboard
router.get('/', async (req, res) => {
  try {
    const scores = await Score.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $group: {
          _id: '$user._id',
          nickname: { $first: '$user.nickname' },
          student_id: { $first: '$user.student_id' },
          highScore: { $max: '$score' }
        }
      },
      { $sort: { highScore: -1 } },
      { $limit: 10 }
    ]);

    res.json(scores);
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

module.exports = router; 