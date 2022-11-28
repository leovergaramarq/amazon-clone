import { Router } from 'express';
import {
    readOne, readMany, createOne, updateOne, deleteOne,
    readProduct, readProducts,
    readReview, readReviews,
    // readCart, addToCart, removeFromCart,
    readPurchase, readPurchases,
    // purchase,
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

router.get('/:id/purchases/:purchaseId', readPurchase);
router.get('/:id/purchases', readPurchases);

// router.get('/:id/cart', [verifyToken, correctUser], readCart);
// router.post('/:id/cart', [verifyToken, correctUser], addToCart);
// router.delete('/:id/cart/:productId', [verifyToken, correctUser], removeFromCart);

// router.post('/:id/purchase', [verifyToken, correctUser], purchase);

export default router;
