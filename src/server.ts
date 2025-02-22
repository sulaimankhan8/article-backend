import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cron from "node-cron";
import fetchArticles from "./services/fetchArticles";
import userRoutes from "./routes/user";
import articleRoutes from "./routes/article";
import generaRoutes from "./routes/genera";
import clerkAuth from "./middleware/clerkAuth";

dotenv.config();
const app = express();


app.use(express.json());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  })
);
app.use("/api/users", userRoutes);
app.use("/api/article", clerkAuth,articleRoutes);
app.use("/api/genera", generaRoutes);
// Print all registered routes
app._router.stack.forEach((middleware: any) => {
  if (middleware.route) {
    console.log(`METHOD: ${Object.keys(middleware.route.methods)} | PATH: ${middleware.route.path}`);
  }
});


// Cron job to fetch articles every hour
cron.schedule("0 * * * *", async () => {
  await fetchArticles();
  console.log("Articles updated");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
