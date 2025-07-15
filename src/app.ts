import express from "express";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";

import categoryRoutes from "./routes/category";
import productRoutes from "./routes/product";

const app = express();

app.use(express.json());

const swaggerDocument = YAML.load(
  path.join(__dirname, "../src/docs/openapi.yaml")
);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/categories", categoryRoutes);
app.use("/products", productRoutes);

export default app;
