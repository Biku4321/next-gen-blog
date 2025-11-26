import express from 'express';
import { createComment, getComments, deleteComment } from '../controllers/commentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createComment);
router.get('/:postId', getComments);
router.delete('/:id', protect, deleteComment);

export default router;
