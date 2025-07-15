/**
 * @param {import('knex').Knex} knex
 */
exports.seed = async function (knex) {
  await knex("products").del();
  await knex("categories").del();

  const rootCategories = [
    { id: knex.raw("gen_random_uuid()"), name: "Электроника", is_active: true },
    { id: knex.raw("gen_random_uuid()"), name: "Одежда", is_active: true },
  ];

  await knex("categories").insert(rootCategories);

  const electronicsCategory = await knex("categories")
    .select("id")
    .where("name", "Электроника")
    .first();

  const clothingCategory = await knex("categories")
    .select("id")
    .where("name", "Одежда")
    .first();

  const subCategories = [
    {
      id: knex.raw("gen_random_uuid()"),
      name: "Смартфоны",
      parent_id: electronicsCategory.id,
      is_active: true,
    },
    {
      id: knex.raw("gen_random_uuid()"),
      name: "Ноутбуки",
      parent_id: electronicsCategory.id,
      is_active: true,
    },
    {
      id: knex.raw("gen_random_uuid()"),
      name: "Мужская одежда",
      parent_id: clothingCategory.id,
      is_active: true,
    },
    {
      id: knex.raw("gen_random_uuid()"),
      name: "Женская одежда",
      parent_id: clothingCategory.id,
      is_active: true,
    },
  ];

  await knex("categories").insert(subCategories);

  const smartphonesCategory = await knex("categories")
    .select("id")
    .where("name", "Смартфоны")
    .first();

  const laptopsCategory = await knex("categories")
    .select("id")
    .where("name", "Ноутбуки")
    .first();

  const products = [
    {
      id: knex.raw("gen_random_uuid()"),
      name: "iPhone 14",
      category_id: smartphonesCategory.id,
      quantity: 10,
      is_active: true,
    },
    {
      id: knex.raw("gen_random_uuid()"),
      name: "MacBook Pro",
      category_id: laptopsCategory.id,
      quantity: 5,
      is_active: true,
    },
  ];

  await knex("products").insert(products);
};
