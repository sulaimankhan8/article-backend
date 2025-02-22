import { Request, Response } from "express";
import { db } from "../config/db";
import { genera } from "../models/schema";

export const getAllGenera = async (req: Request, res: Response) => {
  try {
    const allGenera = await db.select().from(genera);
    res.json(allGenera);
  } catch (error) {
    res.status(500).json({ message: "Error fetching genera", error });
  }
};
