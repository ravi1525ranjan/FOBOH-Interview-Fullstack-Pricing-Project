import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./utils/swagger";
import productRouter from "./routes/product.routes";
import profileRouter from "./routes/profile.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/products", productRouter);
app.use("/api/profiles", profileRouter);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (_req, res) => {
  res.json({ message: "FOBOH Pricing Backend" });
});

export default app;
