import { Router } from "express";
import { signUp, signIn } from "../controllers/auth.controllers.js";

const router = Router();

router.post("/signup", signUp);
router.post("/login", signIn);

export default router;
