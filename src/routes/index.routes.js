import { Router } from 'express';
import user from './user.routes.js';
import product from './product.routes.js';
import cart from './cart.routes.js';
import review from './review.routes.js';
import purchase from './purchase.routes.js';
import auth from './auth.routes.js';
import category from './category.routes.js';

const router = Router();

router.use('/users', user);
router.use('/products', product);
router.use('/cart', cart);
router.use('/reviews', review);
router.use('/purchases', purchase);
router.use('/auth', auth);
router.use('/categories', category);

export default router;
