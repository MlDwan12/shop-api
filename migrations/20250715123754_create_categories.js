exports.up = async function(knex) {
  return knex.schema.createTable("categories", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.string("name").notNullable();
    table
      .uuid("parent_id")
      .references("id")
      .inTable("categories")
      .onDelete("CASCADE");

    table.boolean("is_active").defaultTo(true);
    table.timestamps(true, true);
  });
}

exports.down = async function(knex) {
  return knex.schema.dropTable("categories");
}
