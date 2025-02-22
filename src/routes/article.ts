

import express from "express";
const router = express.Router();
import { getAllArticles, getArticlesForUser, fetchArticlesFromAPI } from "../controllers/articleController";



router.get("/", getAllArticles); // Fetch all articles
// Fetch from external API (should be placed first)
router.get("/fetch-api", async (req, res) => {
  await fetchArticlesFromAPI(req, res);
});

// Fetch articles for a user
router.get("/:clerkId", async (req, res) => {
  await getArticlesForUser(req, res);
});

export default router;
