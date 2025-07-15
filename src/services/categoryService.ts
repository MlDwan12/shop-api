import {
  ICategoryCreate,
  ICategoryUpdate,
} from "../interfaces/category.interface";
import { CategoryModel } from "../models/categoryModel";

export const CategoryService = {
  async createCategory(data: ICategoryCreate) {
    if (data.parent_id) {
      const parent = await CategoryModel.findById(data.parent_id);
      if (!parent) {
        throw new Error("Parent category not found");
      }
    }
    return CategoryModel.create(data);
  },

  async updateCategory(id: string, data: ICategoryUpdate) {
    const category = await CategoryModel.findById(id);
    if (!category) {
      throw new Error("Category not found");
    }
    if (data.parent_id) {
      const parent = await CategoryModel.findById(data.parent_id);
      if (!parent) {
        throw new Error("Parent category not found");
      }
    }
    return CategoryModel.update(id, data);
  },

  async deleteCategory(id: string) {
    const category = await CategoryModel.findById(id);
    if (!category) {
      throw new Error("Category not found");
    }
    return CategoryModel.delete(id);
  },

  async getAllActiveWithProductCount() {
    return CategoryModel.getAllActiveWithProductCountTree();
  },

  async findCategoryById(id: string) {
    const category = await CategoryModel.findById(id);
    if (!category) {
      throw new Error("Category not found");
    }
    return category;
  },
};
