import {
  IProductCreate,
  IProductUpdate,
} from "../interfaces/product.interface";
import { CategoryModel } from "../models/categoryModel";
import { ProductModel } from "../models/productModel";

export const ProductService = {
  async createProduct(data: IProductCreate) {
    const category = await CategoryModel.findById(data.category_id);
    if (!category) {
      throw new Error("Category not found");
    }
    return ProductModel.create(data);
  },

  async updateProduct(id: string, data: IProductUpdate) {
    const product = await ProductModel.findById(id);
    if (!product) {
      throw new Error("Product not found");
    }
    if (data.category_id) {
      const category = await CategoryModel.findById(data.category_id);
      if (!category) {
        throw new Error("Category not found");
      }
    }
    return ProductModel.update(id, data);
  },

  async deleteProduct(id: string) {
    const product = await ProductModel.findById(id);
    if (!product) {
      throw new Error("Product not found");
    }
    return ProductModel.delete(id);
  },

  async getActiveByCategory(category_id: string) {
    const category = await CategoryModel.findById(category_id);
    if (!category) {
      throw new Error("Category not found");
    }
    return ProductModel.getActiveByCategory(category_id);
  },

  async getGroupedByCategories() {
    return ProductModel.getGroupedByCategories();
  },

  async findProductById(id: string) {
    const product = await ProductModel.findById(id);
    if (!product) {
      throw new Error("Product not found");
    }
    return product;
  },
};
