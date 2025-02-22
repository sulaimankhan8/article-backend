import { Request, Response } from "express";
import { db } from "../config/db";
import { articles, users, userGenera, genera } from "../models/schema";
import { and, eq, inArray } from "drizzle-orm";
import axios from "axios";
import "dotenv/config";

/**
 * Fetches all articles from the database.
 */
export const getAllArticles = async (req: Request, res: Response) => {
  try {
    const allArticles = await db.select().from(articles);
    res.json(allArticles);
  } catch (error) {
    res.status(500).json({ message: "Error fetching articles", error });
  }
};

/**
 * Fetches articles based on the user's preferred genres.
 * - Retrieves the user's chosen genres from `userGenera`.
 * - Fetches articles that match those genres.
 */
export const getArticlesForUser = async (req: Request, res: Response) => {
  const { clerkId } = req.params;
  console.log("Received Clerk ID:", clerkId);
  try {
    // Find user ID from Clerk ID
    const user = await db.select().from(users).where(eq(users.clerkId, clerkId));
    if (user.length === 0) return res.status(404).json({ message: "User not found" });
    console.log("User found:", user[0]);
    // Fetch user's preferred genres
    const userGenres = await db.select().from(userGenera).where(eq(userGenera.userId,user[0].id));
    const genreIds = userGenres.map((g) => g.generaId);

    if (genreIds.length === 0) return res.status(400).json({ message: "User has no selected genres" });
    const validGenreIds = genreIds.filter((id): id is number => id !== null);
    
    console.log("User's preferred genres:", genreIds);
    const matchingArticles = await db.select().from(articles).where(inArray(articles.generaId, validGenreIds));
    console.log("Fetched articles:", matchingArticles);
    res.json(matchingArticles);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user articles", error });
  }
};

/**
 * Fetches articles from an external API (SERPAPI) based on a given query.
 * - Uses `axios` to call the SERPAPI API.
 * - Extracts the required article data.
 */
export const fetchArticlesFromAPI = async (req: Request, res: Response) => {
  const { query } = req.query;
  const apiKey = process.env.SERPAPI_API_KEY;

  if (!query) return res.status(400).json({ message: "Query parameter is required" });

  try {
    const response = await axios.get(`https://serpapi.com/search.json`, {
      params: { q: query, api_key: apiKey, tbm: "nws" }, // `tbm=nws` fetches news articles
    });

    const articlesData = response.data?.news_results || [];

    const formattedArticles = articlesData.map((article: any) => ({
      title: article.title,
      url: article.link,
      source: article.source,
      published_date: article.date,
    }));

    res.json(formattedArticles);
  } catch (error) {
    res.status(500).json({ message: "Error fetching articles from API", error });
  }
};
