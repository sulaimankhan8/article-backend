import { Request, Response } from "express";
import { db } from "../config/db";
import { users, userGenera } from "../models/schema";
import { eq } from "drizzle-orm";

export const signupUser = async (req: Request, res: Response) => {
  const { clerkId, email, generaIds } = req.body;

  try {
    const existingUser = await db.select().from(users).where(eq(users.clerkId, clerkId));
    if (existingUser.length > 0) return res.status(400).json({ message: "User already exists" });

    await db.insert(users).values({ clerkId, email });

    if (generaIds.length < 2) return res.status(400).json({ message: "Select at least 2 genres" });

    await db.insert(userGenera).values(generaIds.map((id: number) => ({ userId: clerkId, generaId: id })));

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
};
