import express, { Request, Response } from "express";
import { db } from "../config/db";
import { users, userGenera, articles } from "../models/schema";
import clerkAuth from "../middleware/clerkAuth";
import { eq, inArray } from "drizzle-orm";

const router = express.Router();

// 📝 User Signup Endpoint
router.post("/signup", async (req: Request, res: Response): Promise<void> => {
  try {
    const { clerkId, email, generaIds } = req.body;

    if (!Array.isArray(generaIds) || generaIds.length < 2) {
      res.status(400).json({ message: "Please select at least 2 genres." });
      return;
    }

    // Check if user exists
    const existingUser = await db.select().from(users).where(eq(users.clerkId, clerkId));
    if (existingUser.length > 0) {
      res.status(400).json({ message: "User already exists." });
      return;
    }

    // Insert user
    const [newUser] = await db.insert(users).values({ clerkId, email }).returning({ id: users.id });

    await db.insert(userGenera).values(
      generaIds.map((id) => ({
        userId: newUser.id,
        generaId: id,
      }))
    );

    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Error registering user.", error });
  }
});

// 🛠️ User Login & Fetch Articles
router.get("/login", clerkAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const clerkId = req.auth?.userId; // Get Clerk user ID

    if (!clerkId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    // Find user in DB
    const user = await db.select().from(users).where(eq(users.clerkId, clerkId));
    if (user.length === 0) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const userId = user[0].id;

    // Get user's selected genres
    const userGenres = await db.select().from(userGenera).where(eq(userGenera.userId, userId));
    if (userGenres.length === 0) {
      res.status(200).json({ message: "No genres selected", articles: [] });
      return;
    }

    const generaIds = userGenres.map((g) => g.generaId);

    const filteredGeneraIds = generaIds.filter((id) => id !== null);
const userArticles = await db
  .select()
  .from(articles)
  .where(inArray(articles.generaId, filteredGeneraIds));


    res.status(200).json({ message: "Login successful", articles: userArticles });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Error during login", error });
  }
});

export default router;
