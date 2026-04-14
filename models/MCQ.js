import mongoose from "mongoose";

const McqSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
    index: true // Useful for filtering by subject
  },
  topic: {
    type: String,
    required: [true, 'Topic is required'],
    trim: true
  },
  question: {
    type: String,
    required: [true, 'Question text is required'],
    unique: true // Prevents duplicate questions
  },
  options: {
    type: [String],
    validate: {
      validator: function(v) {
        return v.length >= 2;
      },
      message: 'A question must have at least 2 options.'
    },
    required: true
  },
  answer: {
    type: String,
    required: [true, 'Correct answer is required']
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create the model
const MCQ = mongoose.models.McqSchema || mongoose.model('MCQ', McqSchema);

export default MCQ;