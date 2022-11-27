import { Router } from 'express';
import {
    readOne, readMany, createOne, updateOne, deleteOne
} from '../controllers/category.controllers.js';
import { verifyToken } from '../middlewares/authJwt.js';

const router = Router();

router.get('/', readMany);
router.get('/:id', readOne);
router.post('/', verifyToken, createOne);
router.put('/:id', verifyToken, updateOne);
router.delete('/:id', verifyToken, deleteOne);

export default router;
