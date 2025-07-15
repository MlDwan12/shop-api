import knex from "../db/knex";
import { Category } from "../interfaces/category.interface";

type CreateCategoryData = {
  name: string;
  parent_id?: string | null;
};

type UpdateCategoryData = Partial<{
  name: string;
  parent_id: string | null;
  is_active: boolean;
}>;

export const CategoryModel = {
  async create(data: CreateCategoryData): Promise<Category> {
    const [category] = await knex<Category>("categories")
      .insert(data)
      .returning("*");
    return category;
  },

  async update(
    id: string,
    data: UpdateCategoryData
  ): Promise<Category | undefined> {
    const [category] = await knex<Category>("categories")
      .where({ id })
      .update(data)
      .returning("*");
    return category;
  },

  async delete(id: string): Promise<number> {
    return knex("categories").where({ id }).del();
  },

  async findById(id: string): Promise<Category | undefined> {
    return knex<Category>("categories").where({ id }).first();
  },

  async getAllActiveWithProductCountTree(): Promise<Category[]> {
    const result = await knex.raw(`
      WITH RECURSIVE category_tree AS (
        SELECT 
          id, name, parent_id, is_active, 1 as level
        FROM categories
        WHERE parent_id IS NULL AND is_active = true
        
        UNION ALL
        
        SELECT 
          c.id, c.name, c.parent_id, c.is_active, ct.level + 1
        FROM categories c
        JOIN category_tree ct ON c.parent_id = ct.id
        WHERE ct.level < 3 AND c.is_active = true
      ),
      products_count AS (
        SELECT category_id, COUNT(*) AS product_count
        FROM products
        WHERE is_active = true
        GROUP BY category_id
      )
      SELECT 
        ct.id, ct.name, ct.parent_id, ct.is_active,
        COALESCE(pc.product_count, 0) AS product_count
      FROM category_tree ct
      LEFT JOIN products_count pc ON ct.id = pc.category_id
      ORDER BY ct.parent_id NULLS FIRST, ct.id
    `);

    const rows: (Category & { product_count: number; children: Category[] })[] =
      result.rows.map((row: any) => ({
        ...row,
        children: [],
        product_count: Number(row.product_count) || 0,
      }));

    const map = new Map<string, (typeof rows)[0]>();
    const roots: typeof rows = [];

    rows.forEach((cat) => {
      map.set(cat.id, cat);
    });

    rows.forEach((cat) => {
      if (cat.parent_id) {
        const parent = map.get(cat.parent_id);
        if (parent) {
          parent.children.push(cat);
        }
      } else {
        roots.push(cat);
      }
    });

    return roots;
  },
};
