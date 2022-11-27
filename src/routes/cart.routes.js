import { Router } from 'express';
import { readOne, readMany, createOne, updateOne } from '../controllers/cart.controllers.js';

const router = Router();

router.get('/:id', readOne);
router.get('/', readMany);
router.post('/', createOne);
router.put('/:id', updateOne);

export default router;
