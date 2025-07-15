import { ProductService } from "../../services/productService";
import { ProductModel } from "../../models/productModel";
import { CategoryModel } from "../../models/categoryModel";

jest.mock("../../models/productModel");
jest.mock("../../models/categoryModel");

describe("ProductService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createProduct", () => {
    it("should throw error if category not found", async () => {
      (CategoryModel.findById as jest.Mock).mockResolvedValue(null);

      await expect(
        ProductService.createProduct({
          name: "Prod",
          category_id: "123",
          quantity: 10,
        })
      ).rejects.toThrow("Category not found");

      expect(CategoryModel.findById).toHaveBeenCalledWith("123");
      expect(ProductModel.create).not.toHaveBeenCalled();
    });

    it("should create product if category exists", async () => {
      const data = { name: "Prod", category_id: "123", quantity: 10 };
      (CategoryModel.findById as jest.Mock).mockResolvedValue({
        id: "123",
        name: "Cat",
      });
      (ProductModel.create as jest.Mock).mockResolvedValue(data);

      const result = await ProductService.createProduct(data);

      expect(CategoryModel.findById).toHaveBeenCalledWith("123");
      expect(ProductModel.create).toHaveBeenCalledWith(data);
      expect(result).toEqual(data);
    });
  });

  describe("updateProduct", () => {
    it("should throw error if product not found", async () => {
      (ProductModel.findById as jest.Mock).mockResolvedValue(null);

      await expect(
        ProductService.updateProduct("1", { name: "Updated" })
      ).rejects.toThrow("Product not found");

      expect(ProductModel.findById).toHaveBeenCalledWith("1");
      expect(ProductModel.update).not.toHaveBeenCalled();
    });

    it("should throw error if category_id provided but category not found", async () => {
      (ProductModel.findById as jest.Mock).mockResolvedValue({
        id: "1",
        name: "Prod 1",
      });
      (CategoryModel.findById as jest.Mock).mockResolvedValue(null);

      await expect(
        ProductService.updateProduct("1", { category_id: "999" })
      ).rejects.toThrow("Category not found");

      expect(ProductModel.findById).toHaveBeenCalledWith("1");
      expect(CategoryModel.findById).toHaveBeenCalledWith("999");
      expect(ProductModel.update).not.toHaveBeenCalled();
    });

    it("should update product if product and category exist", async () => {
      (ProductModel.findById as jest.Mock).mockResolvedValue({
        id: "1",
        name: "Prod 1",
      });
      (CategoryModel.findById as jest.Mock).mockResolvedValue({
        id: "999",
        name: "Cat 999",
      });
      (ProductModel.update as jest.Mock).mockResolvedValue({
        id: "1",
        name: "Updated",
        category_id: "999",
      });

      const result = await ProductService.updateProduct("1", {
        name: "Updated",
        category_id: "999",
      });

      expect(ProductModel.findById).toHaveBeenCalledWith("1");
      expect(CategoryModel.findById).toHaveBeenCalledWith("999");
      expect(ProductModel.update).toHaveBeenCalledWith("1", {
        name: "Updated",
        category_id: "999",
      });
      expect(result).toEqual({ id: "1", name: "Updated", category_id: "999" });
    });
  });

  describe("deleteProduct", () => {
    it("should throw error if product not found", async () => {
      (ProductModel.findById as jest.Mock).mockResolvedValue(null);

      await expect(ProductService.deleteProduct("1")).rejects.toThrow(
        "Product not found"
      );

      expect(ProductModel.findById).toHaveBeenCalledWith("1");
      expect(ProductModel.delete).not.toHaveBeenCalled();
    });

    it("should delete product if found", async () => {
      (ProductModel.findById as jest.Mock).mockResolvedValue({
        id: "1",
        name: "Prod 1",
      });
      (ProductModel.delete as jest.Mock).mockResolvedValue(1);

      const result = await ProductService.deleteProduct("1");

      expect(ProductModel.findById).toHaveBeenCalledWith("1");
      expect(ProductModel.delete).toHaveBeenCalledWith("1");
      expect(result).toBe(1);
    });
  });

  describe("getActiveByCategory", () => {
    it("should throw error if category not found", async () => {
      (CategoryModel.findById as jest.Mock).mockResolvedValue(null);

      await expect(ProductService.getActiveByCategory("123")).rejects.toThrow(
        "Category not found"
      );

      expect(CategoryModel.findById).toHaveBeenCalledWith("123");
      expect(ProductModel.getActiveByCategory).not.toHaveBeenCalled();
    });

    it("should return active products if category exists", async () => {
      const products = [{ id: "1", name: "Prod 1" }];
      (CategoryModel.findById as jest.Mock).mockResolvedValue({
        id: "123",
        name: "Cat",
      });
      (ProductModel.getActiveByCategory as jest.Mock).mockResolvedValue(
        products
      );

      const result = await ProductService.getActiveByCategory("123");

      expect(CategoryModel.findById).toHaveBeenCalledWith("123");
      expect(ProductModel.getActiveByCategory).toHaveBeenCalledWith("123");
      expect(result).toEqual(products);
    });
  });

  describe("getGroupedByCategories", () => {
    it("should return grouped products", async () => {
      const grouped = [{ category_id: "1", products: [] }];
      (ProductModel.getGroupedByCategories as jest.Mock).mockResolvedValue(
        grouped
      );

      const result = await ProductService.getGroupedByCategories();

      expect(ProductModel.getGroupedByCategories).toHaveBeenCalled();
      expect(result).toEqual(grouped);
    });
  });

  describe("findProductById", () => {
    it("should throw error if product not found", async () => {
      (ProductModel.findById as jest.Mock).mockResolvedValue(null);

      await expect(ProductService.findProductById("1")).rejects.toThrow(
        "Product not found"
      );

      expect(ProductModel.findById).toHaveBeenCalledWith("1");
    });

    it("should return product if found", async () => {
      const product = { id: "1", name: "Prod 1" };
      (ProductModel.findById as jest.Mock).mockResolvedValue(product);

      const result = await ProductService.findProductById("1");

      expect(ProductModel.findById).toHaveBeenCalledWith("1");
      expect(result).toEqual(product);
    });
  });
});
