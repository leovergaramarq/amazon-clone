import { Router } from 'express';
import {
    readOne, readMany, createOne, updateOne, deleteOne,
    readReview, readReviews
} from '../controllers/product.controllers.js';
import { verifyToken } from '../middlewares/authJwt.js';

const router = Router();

router.get('/', readMany);
router.get('/:id', readOne);
router.post('/', verifyToken, createOne);
router.put('/:id', verifyToken, updateOne);
router.delete('/:id', verifyToken, deleteOne);

router.get('/:id/reviews/:reviewId', readReview);
router.get('/:id/reviews', readReviews);

export default router;
