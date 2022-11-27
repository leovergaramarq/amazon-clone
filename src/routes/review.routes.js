import { Router } from "express";
import { readOne, readMany, createOne, updateOne, deleteOne } from "../controllers/review.controllers.js";

const router = Router();

router.get("/:id", readOne);
router.get("/", readMany);
router.post("/", createOne);
router.put("/:id", updateOne);
router.delete("/:id", deleteOne);

export default router;
