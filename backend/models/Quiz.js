import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }, 
    documentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document",
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    questions: [{
        question: { 
            type: String,
        required: true
        },
        options: {
            type: [String],
            validate: [array => array.length === 4, 'Must have exactly 4 options'],
            required: true
        },
        correctAnswer: {
            type: String,
            required: true,
        },
        explanation: {
            type: String,
            default: "No explanation provided."
        },
        difficulty: {
            type: String,
            enum: ['easy', 'medium', 'hard'],
            default: 'medium'
        }
    }],
    userAnswers: [{
        questionIndex: {
            type: Number,
            required: true
        },
        selectedAnswer: {
            type: String,
            required: true
        },
        isCorrect: {
            type: Boolean,
            required: true
        },
        answeredAt: {
            type: Date,
            default: Date.now
        }
    }],
    score: {
        type: Number,
        default: 0
    },
    totalQuestions: {
        type: Number,
        required: true
    }
}, { 
    timestamps: true 
}); 

//Index for faster retrieval of quizzes by user and document
quizSchema.index({ userId: 1, documentId: 1 });

const Quiz = mongoose.model("Quiz", quizSchema);

export default Quiz;

