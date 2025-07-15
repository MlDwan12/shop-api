import * as categoryController from "../../controllers/categoryController";
import { ICategoryCreate } from "../../interfaces/category.interface";
import { CategoryService } from "../../services/categoryService";

jest.mock("../../services/categoryService");

// Приводим сервис к типу мокированных методов Jest
const mockedCategoryService = CategoryService as jest.Mocked<
  typeof CategoryService
>;

describe("categoryController", () => {
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

  describe("createCategory", () => {
    it("should create category and return 201", async () => {
      const fakeCategory = {
        id: "1",
        name: "Cat1",
        is_active: true,
      };
      mockedCategoryService.createCategory.mockResolvedValue(fakeCategory);
      req.body = { name: "Cat1" };

      await categoryController.createCategory(req, res);

      expect(mockedCategoryService.createCategory).toHaveBeenCalledWith(
        req.body
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(fakeCategory);
    });
  });

  describe("updateCategory", () => {
    it("should return 400 if id not provided", async () => {
      req.params = {};
      req.body = {};

      await categoryController.updateCategory(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Category ID required" });
    });

    it("should update category and return json", async () => {
      req.params = { id: "1" };
      req.body = { name: "Updated" };
      const updatedCategory = {
        id: "1",
        name: "Updated",
        is_active: true,
      };
      mockedCategoryService.updateCategory.mockResolvedValue(updatedCategory);

      await categoryController.updateCategory(req, res);

      expect(mockedCategoryService.updateCategory).toHaveBeenCalledWith(
        "1",
        req.body
      );
      expect(res.json).toHaveBeenCalledWith(updatedCategory);
    });

    it("should return 404 if category not found", async () => {
      req.params = { id: "1" };
      req.body = {};
      mockedCategoryService.updateCategory.mockRejectedValue(
        new Error("Category not found")
      );

      await categoryController.updateCategory(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Category not found" });
    });

    it("should return 400 for other errors", async () => {
      req.params = { id: "1" };
      req.body = {};
      mockedCategoryService.updateCategory.mockRejectedValue(
        new Error("Some error")
      );

      await categoryController.updateCategory(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Some error" });
    });
  });

  describe("deleteCategory", () => {
    it("should return 400 if id not provided", async () => {
      req.params = {};

      await categoryController.deleteCategory(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Category ID required" });
    });

    it("should delete category and return 204", async () => {
      req.params = { id: "1" };
      mockedCategoryService.deleteCategory.mockResolvedValue(1);

      await categoryController.deleteCategory(req, res);

      expect(mockedCategoryService.deleteCategory).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it("should return 404 if category not found", async () => {
      req.params = { id: "1" };
      mockedCategoryService.deleteCategory.mockRejectedValue(
        new Error("Category not found")
      );

      await categoryController.deleteCategory(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Category not found" });
    });

    it("should return 400 for other errors", async () => {
      req.params = { id: "1" };
      mockedCategoryService.deleteCategory.mockRejectedValue(
        new Error("Other error")
      );

      await categoryController.deleteCategory(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Other error" });
    });
  });

  describe("getActiveCategories", () => {
    it("should return categories json", async () => {
      const categories = [{ id: "1", name: "Cat1", is_active: true }];
      mockedCategoryService.getAllActiveWithProductCount.mockResolvedValue(
        categories
      );

      await categoryController.getActiveCategories(req, res);

      expect(
        mockedCategoryService.getAllActiveWithProductCount
      ).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(categories);
    });

    it("should return 500 if error occurs", async () => {
      mockedCategoryService.getAllActiveWithProductCount.mockRejectedValue(
        new Error("DB error")
      );

      await categoryController.getActiveCategories(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "DB error" });
    });
  });
});
