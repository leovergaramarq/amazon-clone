import { Router } from "express";
import { readOne, readMany } from "../controllers/purchase.controllers.js";

const router = Router();

router.get("/", readMany);
router.get("/:id", readOne);

export default router;
