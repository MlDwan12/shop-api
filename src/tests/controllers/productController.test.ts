import * as productController from "../../controllers/productController";
import { Product } from "../../interfaces/product.interface";
import { ProductService } from "../../services/productService";

jest.mock("../../services/productService");

const mockedProductService = ProductService as jest.Mocked<
  typeof ProductService
>;

describe("productController", () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = {
      params: {},
      body: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe("createProduct", () => {
    it("should create product and return 201", async () => {
      const fakeProduct: Product = {
        id: "1",
        name: "Product 1",
        category_id: "10",
        is_active: true,
        quantity: 5,
      };
      mockedProductService.createProduct.mockResolvedValue(fakeProduct);
      req.body = { name: "Product 1", category_id: "10", quantity: 5 };

      await productController.createProduct(req, res);

      expect(mockedProductService.createProduct).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(fakeProduct);
    });

    it("should return 400 if error occurs", async () => {
      mockedProductService.createProduct.mockRejectedValue(new Error("Fail"));
      req.body = { name: "Product 1" };

      await productController.createProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Fail" });
    });
  });

  describe("updateProduct", () => {
    it("should return 400 if id not provided", async () => {
      req.params = {};
      req.body = {};

      await productController.updateProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Product ID required" });
    });

    it("should update product and return json", async () => {
      req.params = { id: "1" };
      req.body = { name: "Updated Product" };

      const updatedProduct = {
        id: "1",
        name: "Updated Product",
        category_id: "10",
        is_active: true,
        quantity: 100,
      };

      mockedProductService.updateProduct.mockResolvedValue(updatedProduct);

      await productController.updateProduct(req, res);

      expect(mockedProductService.updateProduct).toHaveBeenCalledWith(
        "1",
        req.body
      );
      expect(res.json).toHaveBeenCalledWith(updatedProduct);
    });

    it("should return 404 if product not found", async () => {
      req.params = { id: "1" };
      req.body = {};
      mockedProductService.updateProduct.mockRejectedValue(
        new Error("Product not found")
      );

      await productController.updateProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Product not found" });
    });

    it("should return 400 for other errors", async () => {
      req.params = { id: "1" };
      req.body = {};
      mockedProductService.updateProduct.mockRejectedValue(
        new Error("Some error")
      );

      await productController.updateProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Some error" });
    });
  });

  describe("deleteProduct", () => {
    it("should return 400 if id not provided", async () => {
      req.params = {};

      await productController.deleteProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Product ID required" });
    });

    it("should delete product and return 204", async () => {
      req.params = { id: "1" };
      mockedProductService.deleteProduct.mockResolvedValue(1);

      await productController.deleteProduct(req, res);

      expect(mockedProductService.deleteProduct).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it("should return 404 if product not found", async () => {
      req.params = { id: "1" };
      mockedProductService.deleteProduct.mockRejectedValue(
        new Error("Product not found")
      );

      await productController.deleteProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Product not found" });
    });

    it("should return 400 for other errors", async () => {
      req.params = { id: "1" };
      mockedProductService.deleteProduct.mockRejectedValue(
        new Error("Other error")
      );

      await productController.deleteProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Other error" });
    });
  });

  describe("getProductsByCategory", () => {
    it("should return 400 if categoryId not provided", async () => {
      req.params = {};

      await productController.getProductsByCategory(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Category ID required" });
    });

    it("should return products json", async () => {
      const products = [
        {
          id: "1",
          name: "Product 1",
          category_id: "123",
          is_active: true,
          quantity: 10,
        },
      ];

      mockedProductService.getActiveByCategory.mockResolvedValue(products);
      req.params = { categoryId: "123" };

      await productController.getProductsByCategory(req, res);

      expect(mockedProductService.getActiveByCategory).toHaveBeenCalledWith(
        "123"
      );
      expect(res.json).toHaveBeenCalledWith(products);
    });

    it("should return 500 if error occurs", async () => {
      mockedProductService.getActiveByCategory.mockRejectedValue(
        new Error("DB error")
      );
      req.params = { categoryId: "123" };

      await productController.getProductsByCategory(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "DB error" });
    });
  });

  describe("getProductsGroupedByCategory", () => {
    it("should return grouped products json", async () => {
      const grouped = [
        {
          category_id: "1",
          category_name: "Category 1",
          product_count: 1,
          products: [
            {
              id: "1",
              name: "Product 1",
              category_id: "1",
              is_active: true,
              quantity: 5,
            },
          ],
        },
      ];

      mockedProductService.getGroupedByCategories.mockResolvedValue(grouped);

      await productController.getProductsGroupedByCategory(req, res);

      expect(mockedProductService.getGroupedByCategories).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(grouped);
    });

    it("should return 500 if error occurs", async () => {
      mockedProductService.getGroupedByCategories.mockRejectedValue(
        new Error("DB error")
      );

      await productController.getProductsGroupedByCategory(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "DB error" });
    });
  });
});
