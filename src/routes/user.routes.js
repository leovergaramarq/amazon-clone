import { Router } from 'express';
import {
    readOne, readMany, createOne, updateOne, deleteOne,
    readProduct, readProducts,
    readReview, readReviews,
    readCart, addToCart, removeFromCart, purchase,
    readPurchase, readPurchases
} from '../controllers/user.controllers.js';
import { verifyToken, correctUser } from '../middlewares/authJwt.js';

const router = Router();

router.get('/', readMany);
router.get('/:id', readOne);
router.post('/', createOne);
router.put('/:id', [verifyToken, correctUser], updateOne);
router.delete('/:id', [verifyToken, correctUser], deleteOne);

router.get('/:id/reviews/:reviewId', readReview);
router.get('/:id/reviews', readReviews);

router.get('/:id/products/:productId', readProduct);
router.get('/:id/products', readProducts);

router.get('/:id/cart', readCart);
router.post('/:id/cart', addToCart);
router.delete('/:id/cart/:productId', removeFromCart);
router.post('/:id/cart/purchase', purchase);

router.get('/:id/hsitory/:purchaseId', readPurchase);
router.get('/:id/hsitory', readPurchases);

export default router;
