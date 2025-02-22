import express from "express";
import { db } from "../config/db";
import { genera } from "../models/schema";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const allGenera = await db.select().from(genera);
    res.json(allGenera);
  } catch (error) {
    res.status(500).json({ message: "Error fetching genera", error });
  }
});

export default router;
