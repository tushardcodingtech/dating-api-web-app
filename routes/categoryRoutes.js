import express from "express";
import {
  seedCategories,
  getCategories,
  getCategoryById,
} from "../controllers/categoryController.js";

const router = express.Router();

router.post("/seed", seedCategories);
router.get("/", getCategories);
router.get("/:id", getCategoryById);

export default router;
