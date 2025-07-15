import type { Knex } from "knex";

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "pg",
    connection: {
      host: "db", // Важно: имя сервиса из docker-compose
      port: 5432,
      user: "postgres",
      password: "password", // Должно совпадать с docker-compose
      database: "shop_db",
    },
    migrations: {
      directory: "./migrations",
      extension: "ts", // Если миграции на TypeScript
    },
    seeds: {
      directory: "./seeds",
    },
  },
};

export default config;
