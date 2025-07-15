import { Router } from "express";
import * as productController from "../controllers/productController";

const router = Router();

router.post("/", productController.createProduct);

router.put("/:id", productController.updateProduct);

router.delete("/:id", productController.deleteProduct);

router.get("/category/:categoryId", productController.getProductsByCategory);

router.get("/grouped", productController.getProductsGroupedByCategory);

export default router;
