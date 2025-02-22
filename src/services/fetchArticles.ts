import axios from "axios";
import { db } from "../config/db";
import { articles, userGenera, users, genera } from "../models/schema";
import { eq } from "drizzle-orm";

const SERP_API_KEY = process.env.SERPAPI_API_KEY;

export default async function fetchArticles() {
  try {
    // Get all users and their selected genres
    const userGenres = await db.select().from(userGenera);

    for (const { userId, generaId } of userGenres) {
      // Get genre name
      if (generaId === null || generaId === undefined) {
        throw new Error("Invalid generaId: it must not be null or undefined.");
      }
      
      const genre = await db.select().from(genera).where(eq(genera.id, generaId));
      
      
      if (!genre.length) continue;

      // Fetch 10 articles per genre
      const response = await axios.get(`https://serpapi.com/search.json`, {
        params: {
          q: genre[0].name, // Search based on genre name
          api_key: SERP_API_KEY,
        },
      });

      const fetchedArticles = response.data.organic_results
        .slice(0, 10) // Limit to 10 articles
        .map((article: any) => ({
          title: article.title,
          url: article.link,
          generaId,
        }));

      // Insert fetched articles
      await db.insert(articles).values(fetchedArticles);
    }

    console.log("✅ Articles updated successfully");
  } catch (error) {
    console.error("❌ Error fetching articles", error);
  }
}
