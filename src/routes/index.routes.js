import { Router } from "express";
import user from "./user.routes.js";
import product from "./product.routes.js";
import cart from "./cart.routes.js";
import review from "./review.routes.js";
import purchase from "./purchase.routes.js";
import auth from "./auth.routes.js";

const router = Router();

router.use("/users", user);
router.use("/products", product);
router.use("/carts", cart);
router.use("/reviews", review);
router.use("/purchases", purchase);
router.use("/auth", auth);

export default router;
