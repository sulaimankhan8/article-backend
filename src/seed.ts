import { db } from "./config/db"; 
import { genera, userGenera } from "./models/schema";

async function insertGenera() {
  try {
    // Insert genres first
    await db.insert(genera).values([
      { name: "Hero" },
      { name: "JJK" },
      { name: "GAME" },
      { name: "PING" },
    ]);
    console.log("Genres inserted successfully!");
  } catch (error) {
    console.error("Error inserting genres:", error);
  }
}

insertGenera();
