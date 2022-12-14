import { Router } from 'express';
import { readOne, readMany, createOne, deleteOne } from '../controllers/review.controllers.js';
import { verifyToken } from '../middlewares/authJwt.js';

const router = Router();

router.get('/:id', readOne);
router.get('/', readMany);
router.post('/', verifyToken, createOne);
router.delete('/:id', verifyToken, deleteOne);

export default router;
