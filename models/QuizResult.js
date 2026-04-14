import mongoose from "mongoose";

const QuizResultSchema = new mongoose.Schema(
  {
    userId: { 
      type: String, 
      ref: 'User', 
      required: true,
      index: true 
    },
    subject: { 
      type: String, 
      default: "Data Structures" 
    },
    score: { 
      type: Number, 
      required: true 
    },
    totalQuestions: { 
      type: Number, 
      required: true 
    },
    accuracy: { 
      type: Number, 
      required: true 
    },
  },
  { timestamps: true }
);

const QuizResult = mongoose.models.QuizResult || mongoose.model("QuizResult", QuizResultSchema);
export default QuizResult;