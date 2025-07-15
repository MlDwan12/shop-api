import {
  IProductCreate,
  IProductUpdate,
} from "../interfaces/product.interface";
import { ProductService } from "../services/productService";
import type { Request, Response } from "express";

export async function createProduct(
  req: Request<{}, {}, IProductCreate>,
  res: Response
) {
  try {
    const product = await ProductService.createProduct(req.body);
    res.status(201).json(product);
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Error creating product" });
  }
}

export async function updateProduct(
  req: Request<{ id: string }, {}, IProductUpdate>,
  res: Response
) {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "Product ID required" });

    const updated = await ProductService.updateProduct(id, req.body);
    res.json(updated);
  } catch (error: any) {
    if (error.message === "Product not found") {
      return res.status(404).json({ error: error.message });
    }
    res.status(400).json({ error: error.message || "Error updating product" });
  }
}

export async function deleteProduct(
  req: Request<{ id: string }>,
  res: Response
) {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "Product ID required" });

    await ProductService.deleteProduct(id);
    res.status(204).send();
  } catch (error: any) {
    if (error.message === "Product not found") {
      return res.status(404).json({ error: error.message });
    }
    res.status(400).json({ error: error.message || "Error deleting product" });
  }
}

export async function getProductsByCategory(
  req: Request<{ categoryId: string }>,
  res: Response
) {
  try {
    const { categoryId } = req.params;
    if (!categoryId)
      return res.status(400).json({ error: "Category ID required" });

    const products = await ProductService.getActiveByCategory(categoryId);
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Error fetching products" });
  }
}

export async function getProductsGroupedByCategory(
  req: Request,
  res: Response
) {
  try {
    const grouped = await ProductService.getGroupedByCategories();
    res.json(grouped);
  } catch (error: any) {
    res
      .status(500)
      .json({ error: error.message || "Error fetching grouped products" });
  }
}
