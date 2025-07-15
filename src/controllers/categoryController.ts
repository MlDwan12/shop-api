import {
  ICategoryCreate,
  ICategoryUpdate,
} from "../interfaces/category.interface";
import { CategoryService } from "../services/categoryService";
import type { Request, Response } from "express";

export async function createCategory(
  req: Request<{}, {}, ICategoryCreate>,
  res: Response
) {
  try {
    const category = await CategoryService.createCategory(req.body);
    res.status(201).json(category);
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Error creating category" });
  }
}

export async function updateCategory(
  req: Request<{ id: string }, {}, ICategoryUpdate>,
  res: Response
) {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "Category ID required" });

    const updated = await CategoryService.updateCategory(id, req.body);
    res.json(updated);
  } catch (error: any) {
    if (error.message === "Category not found") {
      return res.status(404).json({ error: error.message });
    }
    res.status(400).json({ error: error.message || "Error updating category" });
  }
}

export async function deleteCategory(
  req: Request<{ id: string }>,
  res: Response
) {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "Category ID required" });

    await CategoryService.deleteCategory(id);
    res.status(204).send();
  } catch (error: any) {
    if (error.message === "Category not found") {
      return res.status(404).json({ error: error.message });
    }
    res.status(400).json({ error: error.message || "Error deleting category" });
  }
}

export async function getActiveCategories(req: Request, res: Response) {
  try {
    const categories = await CategoryService.getAllActiveWithProductCount();
    res.json(categories);
  } catch (error: any) {
    res
      .status(500)
      .json({ error: error.message || "Error fetching categories" });
  }
}
