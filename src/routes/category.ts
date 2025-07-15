import { Router } from "express";
import * as categoryController from "../controllers/categoryController";

const router = Router();

router.post("/", categoryController.createCategory);

router.put("/:id", categoryController.updateCategory);

router.delete("/:id", categoryController.deleteCategory);

router.get("/", categoryController.getActiveCategories);

export default router;
