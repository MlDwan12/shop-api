import knex from "../db/knex";
import { Product } from "../interfaces/product.interface";

type CreateProductData = {
  name: string;
  category_id: string;
  quantity?: number;
};

type UpdateProductData = Partial<{
  name: string;
  category_id: string;
  is_active: boolean;
  quantity: number;
}>;

export const ProductModel = {
  async create(data: CreateProductData): Promise<Product> {
    const [product] = await knex<Product>("products")
      .insert(data)
      .returning("*");
    return product;
  },

  async update(
    id: string,
    data: UpdateProductData
  ): Promise<Product | undefined> {
    const [product] = await knex<Product>("products")
      .where({ id })
      .update(data)
      .returning("*");
    return product;
  },

  async delete(id: string): Promise<number> {
    return knex("products").where({ id }).del();
  },

  async findById(id: string): Promise<Product | undefined> {
    return knex<Product>("products").where({ id }).first();
  },

  async getActiveByCategory(category_id: string): Promise<Product[]> {
    return knex<Product>("products").where({ category_id, is_active: true });
  },

  async getGroupedByCategories(): Promise<
    {
      category_id: string;
      category_name: string;
      product_count: number;
      products: Product[];
    }[]
  > {
    const rows = await knex("categories")
      .select(
        "categories.id as category_id",
        "categories.name as category_name"
      )
      .leftJoin("products", "categories.id", "products.category_id")
      .where("categories.is_active", true)
      .groupBy("categories.id")
      .count("products.id as product_count")
      .select(
        knex.raw(
          "COALESCE(json_agg(products.*) FILTER (WHERE products.id IS NOT NULL), '[]') as products"
        )
      );

    return rows.map((row) => ({
      category_id: String(row.category_id),
      category_name: String(row.category_name),
      product_count: Number(row.product_count),
      products:
        typeof row.products === "string"
          ? JSON.parse(row.products)
          : row.products || [],
    }));
  },
};
