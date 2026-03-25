import Document from "../models/Document.js";
import Flashcard from "../models/Flashcard.js"
import Quiz from "../models/Quiz.js"
import ChatHistory from "../models/ChatHistory.js"
import * as geminiService from "../utils/geminiService.js"
import { findRelaventChunks } from "../utils/textChunker.js";


//@desc Generate flashcards from document
//@route POST /api/ai/generate-flashcards
//@access Private
export const generateFlashcards = async (req, res, next) => {
    try {
        const { documentId, count = 10 } = req.body

        if (!documentId) {
            return res.status(400).json({
                success: false,
                message: 'Please provide Document ID',
                statusCode: 400
            })
        }

        const document = await Document.findOne({
            _id: documentId,
            userId: req.user._id,
            status: 'ready'
        });

        if (!document) {
            return res.status(404).json({
                success: false,
                error: 'Document not found or not ready',
                statusCode: 404
            })
        }

        //Generate Flashcards using gemini
        const cards = await geminiService.generateFlashcards(document.extractedText, parseInt(count))

        //Save to database
        const flashcardSet = await Flashcard.create({
            userId: req.user._id,
            documentId: document._id,
            cards: cards.map(card => ({
                question: card.question,
                answer: card.answer,
                difficulty: card.difficulty,
                reviewCount: 0,
                isStarred: false
            }))
        })

        res.status(201).json({
            success: true,
            data: flashcardSet,
            message: 'Flashcard generated successfully'
        });
    }
    catch (error) {
        next(error)
    }
}

//@desc Generate quiz from document
//@route POST /api/ai/generate-quiz
//@access Private
export const generateQuiz = async (req, res, next) => {
    try {
        const { documentId, numQuestions = 5, title } = req.body

        if (!documentId) {
            return res.status(400).json({
                success: false,
                message: 'Please provide Document ID',
                statusCode: 400
            })
        }

        const document = await Document.findOne({
            _id: documentId,
            userId: req.user._id,
            status: 'ready'
        });

        if (!document) {
            return res.status(404).json({
                success: false,
                error: 'Document not found or not ready',
                statusCode: 404
            })
        }

        //Generate Quiz using gemini
        const questions = await geminiService.generateQuiz(document.extractedText, parseInt(numQuestions))

        //Save to database
        const quiz = await Quiz.create({
            userId: req.user._id,
            documentId: document._id,
            title: title || `${document.title} - Quiz`,
            questions: questions,
            totalQuestions: questions.length,
            userAnswers: [],
            score: 0
        });

        res.status(201).json({
            success: true,
            data: quiz,
            message: 'Quiz generated successfully'
        });
    }
    catch (error) {
        next(error)
    }
}

//@desc Generate document summary
//@route POST /api/ai/generate-summary
//@access Private
export const generateSummary = async (req, res, next) => {
    try {
        const { documentId } = req.body

        if (!documentId) {
            return res.status(400).json({
                success: false,
                message: 'Please provide Document ID',
                statusCode: 400
            })
        }

        const document = await Document.findOne({
            _id: documentId,
            userId: req.user._id,
            status: 'ready'
        });

        if (!document) {
            return res.status(404).json({
                success: false,
                error: 'Document not found or not ready',
                statusCode: 404
            })
        }

        //Generate Summary using gemini
        const summary = await geminiService.generateSummary(document.extractedText)

        res.status(201).json({
            success: true,
            data: {
                documentId: document._id,
                title: document.title,
                summary
            },
            message: 'Summary generated successfully'
        });
    }
    catch (error) {
        next(error)
    }
}

//@desc Chat with document
//@route POST /api/ai/chat
//@access Private
export const chat = async (req, res, next) => {
    try {
        const { documentId, question } = req.body

        if (!documentId || !question) {
            return res.status(400).json({
                success: false,
                message: 'Please provide Document ID and question',
                statusCode: 400
            })
        }

        const document = await Document.findOne({
            _id: documentId,
            userId: req.user._id,
            status: 'ready'
        });

        if (!document) {
            return res.status(404).json({
                success: false,
                error: 'Document not found or not ready',
                statusCode: 404
            })
        }

        //Find relavent chunks
        const relaventChunks = findRelaventChunks(document.chunks, question, 3);
        const chunkIndices = relaventChunks.map(c => c.chunkIndex)

        // Get or create chat history
        let chatHistory = await ChatHistory.findOne({
            userId: req.user._id,
            documentId: document._id
        })


        if (!chatHistory) {
            chatHistory = await ChatHistory.create({
                userId: req.user._id,
                documentId: document._id,
                messages: []
            })
        }

        //Generate response using Gemini
        const answer = await geminiService.chatWithContext(question, relaventChunks);

        //save conversation
        chatHistory.messages.push(
            {
                role: 'user',
                content: question,
                timestamp: new Date(),
                relaventChunks: []
            },
            {
                role: 'assistant',
                content: answer,
                timestamp: new Date(),
                relaventChunks: chunkIndices
            }
        );

        await chatHistory.save();

        res.status(201).json({
            success: true,
            data: {
                question,
                answer,
                relaventChunks: chunkIndices,
                chatHistoryId: chatHistory._id
            },
            message: 'Response generated successfully'
        });
    }
    catch (error) {
        next(error)
    }
}

//@desc Explain concepts from the document
//@route POST /api/ai/explain-concept
//@access Private
export const explainConcept = async (req, res, next) => {
    try {
        const { documentId, concept } = req.body

        if (!documentId || !concept) {
            return res.status(400).json({
                success: false,
                message: 'Please provide Document ID and concept',
                statusCode: 400
            })
        }

        const document = await Document.findOne({
            _id: documentId,
            userId: req.user._id,
            status: 'ready'
        });

        if (!document) {
            return res.status(404).json({
                success: false,
                error: 'Document not found or not ready',
                statusCode: 404
            })
        }

        //Find relavent chunks
        const relaventChunks = findRelaventChunks(document.chunks, concept, 3);
        const context = relaventChunks.map(c => c.content).join('\n\n')


        //Generate response using Gemini
        const explanation = await geminiService.explainConcept(concept, context);

        res.status(201).json({
            success: true,
            data: {
                concept,
                explanation,
                relaventChunks: relaventChunks.map(c => c.chunkIndex),
            },
            message: 'Explanation generated successfully'
        });
    }
    catch (error) {
        next(error)
    }
}

//@desc Get chat history for a document
//@route GET /api/ai/chat-history/:documentId
//@access Private
export const getChatHistory = async (req, res, next) => {
    try {
        const { documentId } = req.params

        if (!documentId || !concept) {
            return res.status(400).json({
                success: false,
                message: 'Please provide Document ID',
                statusCode: 400
            })
        }


        let chatHistory = await ChatHistory.findOne({
            userId: req.user._id,
            documentId: document._id
        }).select('messages'); //only retrieve the messages array

        if (!chatHistory) {
            return res.status(404).json({
                success: false,
                error: 'No chat history found for this document',
                statusCode: 404
            })
        }

        res.status(201).json({
            success: true,
            data: chatHistory.messages,
            message: 'Chat history retrieved successfully'
        });
    }
    catch (error) {
        next(error)
    }
}
