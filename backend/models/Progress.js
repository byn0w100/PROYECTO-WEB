const mongoose = require('mongoose');

const progressSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  completedLessons: [{
    type: String // We will store the lesson ID like '1.1', '2.1'
  }],
  completedChallenges: [{
    challengeId: String,
    completedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

const Progress = mongoose.model('Progress', progressSchema);
module.exports = Progress;
