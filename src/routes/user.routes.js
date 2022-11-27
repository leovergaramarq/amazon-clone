import { Router } from "express";
import { readOne, readMany, createOne, updateOne, deleteOne } from "../controllers/user.controllers.js";

const router = Router();

router.get("/", readMany);
router.get("/:id", readOne);
router.post("/", createOne);
router.put("/:id", updateOne);
router.delete("/:id", deleteOne);

export default router;
