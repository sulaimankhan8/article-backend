import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/models/schema.ts", // Ensure your schema file is correctly placed
  out: "./drizzle",
  dialect: "postgresql",
  
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
