import app from "./app";
import { env } from "./config/env";
import { connectDB } from "./config/db";

const startServer = async (): Promise<void> => {
  await connectDB(env.mongoUri);

  app.listen(env.port, () => {
    console.log(`Server is running on http://localhost:${env.port}`);
  });
};

startServer();