import express from 'express'
import{getFlashcards, getAllFlashcardSets, reviewFlashcards, toggleStarFlashcards, deleteFlashcardSets} from '../controllers/flashcardController.js'
import protect from '../middleware/auth.js'

const router = express.Router();

//All routes are protected
router.use(protect);

router.get('/', getAllFlashcardSets);
router.get('/:documentId', getFlashcards);
router.post('/:cardId/review', reviewFlashcards);
router.put('/:cardId/star', toggleStarFlashcards);
router.delete('/:id', deleteFlashcardSets);

export default router;
