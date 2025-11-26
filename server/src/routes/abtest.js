import express from 'express';
import { getTestVariant } from '../controllers/abtestController.js';

const router = express.Router();

router.get('/:testName', getTestVariant);

export default router;