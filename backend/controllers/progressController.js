const Progress = require('../models/Progress');
const User = require('../models/User');

// @desc    Get user progress
// @route   GET /api/progress
// @access  Private
const getProgress = async (req, res) => {
  try {
    const progress = await Progress.findOne({ user: req.user.id });
    if (!progress) {
      return res.status(404).json({ message: 'Progress not found' });
    }
    res.status(200).json(progress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update progress (mark lesson as done/undone)
// @route   POST /api/progress
// @access  Private
const updateProgress = async (req, res) => {
  try {
    const { lessonId, done } = req.body;
    if (!lessonId) {
      return res.status(400).json({ message: 'Please provide lessonId' });
    }

    let progress = await Progress.findOne({ user: req.user.id });
    if (!progress) {
      progress = await Progress.create({ user: req.user.id, completedLessons: [] });
    }

    let xpGained = 0;
    
    // Add or remove lesson
    if (done) {
      if (!progress.completedLessons.includes(lessonId)) {
        progress.completedLessons.push(lessonId);
        xpGained = 10; // 10 XP per lesson
      }
    } else {
      progress.completedLessons = progress.completedLessons.filter(id => id !== lessonId);
      xpGained = -10;
    }

    await progress.save();

    // Update user XP if XP gained/lost
    if (xpGained !== 0) {
      const user = await User.findById(req.user.id);
      user.xp += xpGained;
      if (user.xp < 0) user.xp = 0;
      
      // Calculate level (every 50 XP is a level)
      user.level = Math.floor(user.xp / 50) + 1;
      
      await user.save();
    }

    res.status(200).json(progress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Validate CTF Flag
// @route   POST /api/progress/validate-flag
// @access  Private
const validateFlag = async (req, res) => {
  try {
    const { challengeId, flag } = req.body;
    
    // This is a basic mock validation. In a real app, we'd query a Challenge DB.
    // For now, let's say flag format is: flag_{challengeId}
    const correctFlag = `flag_${challengeId}`;
    
    if (flag !== correctFlag) {
      return res.status(400).json({ message: 'Incorrect flag!', success: false });
    }

    let progress = await Progress.findOne({ user: req.user.id });
    
    // Check if already completed
    const alreadyCompleted = progress.completedChallenges.find(c => c.challengeId === challengeId);
    if (alreadyCompleted) {
      return res.status(400).json({ message: 'Challenge already completed!', success: false });
    }

    progress.completedChallenges.push({ challengeId });
    await progress.save();

    // Give XP
    const user = await User.findById(req.user.id);
    user.xp += 50; // Challenge gives 50 XP
    user.level = Math.floor(user.xp / 50) + 1;
    await user.save();

    res.status(200).json({ message: 'Flag validated successfully!', success: true, xpGained: 50 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getProgress,
  updateProgress,
  validateFlag
};
