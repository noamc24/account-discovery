import express from "express";
import cors from "cors";
import healthRoutes from "./routes/health.routes";
import authRoutes from "./routes/auth.routes";
import { errorHandler } from "./middleware/error.middleware";
import userRoutes from "./routes/user.routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/users", userRoutes);

app.use("/api", healthRoutes);
app.use("/api/auth", authRoutes);

app.use(errorHandler);

export default app;