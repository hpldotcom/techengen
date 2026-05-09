import express from 'express';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { fakePay } from '../controllers/paymentController.js';

const router = express.Router();

router.post('/:orderId', verifyToken, fakePay);

export default router;