import { Router } from 'express';
import { readOne, addProduct, removeProduct } from '../controllers/cart.controllers.js';
import { verifyToken } from '../middlewares/authJwt.js';

const router = Router();

router.get('/', verifyToken, readOne);
router.post('/', verifyToken, addProduct);
router.delete('/:productId', verifyToken, removeProduct);

export default router;
