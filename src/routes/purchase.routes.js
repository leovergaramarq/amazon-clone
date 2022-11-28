import { Router } from "express";
import { readOne, readMany, createOne } from "../controllers/purchase.controllers.js";
import { verifyToken } from "../middlewares/authJwt.js";

const router = Router();

router.get("/", readMany);
router.get("/:id", readOne);
router.post("/", verifyToken, createOne);

export default router;
