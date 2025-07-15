import { CategoryService } from "../../services/categoryService";
import { CategoryModel } from "../../models/categoryModel";

jest.mock("../../models/categoryModel");

describe("CategoryService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createCategory", () => {
    it("should create category without parent", async () => {
      const data = { name: "New Category" };
      (CategoryModel.create as jest.Mock).mockResolvedValue(data);

      const result = await CategoryService.createCategory(data);
      expect(CategoryModel.create).toHaveBeenCalledWith(data);
      expect(result).toEqual(data);
    });

    it("should throw error if parent_id is provided but parent not found", async () => {
      const data = { name: "Child Category", parent_id: "123" };
      (CategoryModel.findById as jest.Mock).mockResolvedValue(null);

      await expect(CategoryService.createCategory(data)).rejects.toThrow(
        "Parent category not found"
      );
      expect(CategoryModel.findById).toHaveBeenCalledWith("123");
      expect(CategoryModel.create).not.toHaveBeenCalled();
    });

    it("should create category if parent exists", async () => {
      const data = { name: "Child Category", parent_id: "123" };
      (CategoryModel.findById as jest.Mock).mockResolvedValue({
        id: "123",
        name: "Parent",
      });
      (CategoryModel.create as jest.Mock).mockResolvedValue(data);

      const result = await CategoryService.createCategory(data);
      expect(CategoryModel.findById).toHaveBeenCalledWith("123");
      expect(CategoryModel.create).toHaveBeenCalledWith(data);
      expect(result).toEqual(data);
    });
  });

  describe("updateCategory", () => {
    it("should throw error if category not found", async () => {
      (CategoryModel.findById as jest.Mock).mockResolvedValue(null);

      await expect(
        CategoryService.updateCategory("1", { name: "Updated" })
      ).rejects.toThrow("Category not found");
      expect(CategoryModel.findById).toHaveBeenCalledWith("1");
      expect(CategoryModel.update).not.toHaveBeenCalled();
    });

    it("should throw error if parent_id provided but parent not found", async () => {
      (CategoryModel.findById as jest.Mock).mockResolvedValue({
        id: "1",
        name: "Cat 1",
      });
      (CategoryModel.findById as jest.Mock).mockImplementation((id) =>
        id === "1" ? { id: "1", name: "Cat 1" } : null
      );

      // parent_id points to '2' but parent doesn't exist
      (CategoryModel.findById as jest.Mock).mockResolvedValueOnce({
        id: "1",
        name: "Cat 1",
      }); // category itself
      (CategoryModel.findById as jest.Mock).mockResolvedValueOnce(null); // parent category

      await expect(
        CategoryService.updateCategory("1", { parent_id: "2" })
      ).rejects.toThrow("Parent category not found");

      expect(CategoryModel.findById).toHaveBeenCalledWith("1");
      expect(CategoryModel.findById).toHaveBeenCalledWith("2");
      expect(CategoryModel.update).not.toHaveBeenCalled();
    });

    it("should update category if category and parent exist", async () => {
      (CategoryModel.findById as jest.Mock).mockResolvedValueOnce({
        id: "1",
        name: "Cat 1",
      }); // category
      (CategoryModel.findById as jest.Mock).mockResolvedValueOnce({
        id: "2",
        name: "Parent Cat",
      }); // parent
      (CategoryModel.update as jest.Mock).mockResolvedValue({
        id: "1",
        name: "Updated",
        parent_id: "2",
      });

      const result = await CategoryService.updateCategory("1", {
        name: "Updated",
        parent_id: "2",
      });

      expect(CategoryModel.findById).toHaveBeenCalledWith("1");
      expect(CategoryModel.findById).toHaveBeenCalledWith("2");
      expect(CategoryModel.update).toHaveBeenCalledWith("1", {
        name: "Updated",
        parent_id: "2",
      });
      expect(result).toEqual({ id: "1", name: "Updated", parent_id: "2" });
    });
  });

  describe("deleteCategory", () => {
    it("should throw error if category not found", async () => {
      (CategoryModel.findById as jest.Mock).mockResolvedValue(null);

      await expect(CategoryService.deleteCategory("1")).rejects.toThrow(
        "Category not found"
      );
      expect(CategoryModel.findById).toHaveBeenCalledWith("1");
      expect(CategoryModel.delete).not.toHaveBeenCalled();
    });

    it("should delete category if found", async () => {
      (CategoryModel.findById as jest.Mock).mockResolvedValue({
        id: "1",
        name: "Cat 1",
      });
      (CategoryModel.delete as jest.Mock).mockResolvedValue(1);

      const result = await CategoryService.deleteCategory("1");
      expect(CategoryModel.findById).toHaveBeenCalledWith("1");
      expect(CategoryModel.delete).toHaveBeenCalledWith("1");
      expect(result).toBe(1);
    });
  });

  describe("getAllActiveWithProductCount", () => {
    it("should return categories with product count", async () => {
      const mockData = [{ id: "1", name: "Cat 1", children: [] }];
      (
        CategoryModel.getAllActiveWithProductCountTree as jest.Mock
      ).mockResolvedValue(mockData);

      const result = await CategoryService.getAllActiveWithProductCount();
      expect(CategoryModel.getAllActiveWithProductCountTree).toHaveBeenCalled();
      expect(result).toEqual(mockData);
    });
  });

  describe("findCategoryById", () => {
    it("should throw error if category not found", async () => {
      (CategoryModel.findById as jest.Mock).mockResolvedValue(null);

      await expect(CategoryService.findCategoryById("1")).rejects.toThrow(
        "Category not found"
      );
      expect(CategoryModel.findById).toHaveBeenCalledWith("1");
    });

    it("should return category if found", async () => {
      const category = { id: "1", name: "Cat 1" };
      (CategoryModel.findById as jest.Mock).mockResolvedValue(category);

      const result = await CategoryService.findCategoryById("1");
      expect(CategoryModel.findById).toHaveBeenCalledWith("1");
      expect(result).toEqual(category);
    });
  });
});
