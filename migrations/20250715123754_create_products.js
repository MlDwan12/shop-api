exports.up = async function (knex) {
  return knex.schema.createTable("products", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.string("name").notNullable();
    table
      .uuid("category_id")
      .references("id")
      .inTable("categories")
      .onDelete("CASCADE");
    table.boolean("is_active").defaultTo(true);
    table.integer("quantity").defaultTo(0);
    table.timestamps(true, true);
  });
};

exports.down = async function (knex) {
  return knex.schema.dropTable("products");
};
