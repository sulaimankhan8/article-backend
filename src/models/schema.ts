import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";

// User Table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  clerkId: text("clerk_id").notNull().unique(),
  email: text("email").notNull().unique(),
});

// Genera Table
export const genera = pgTable("genera", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
});

// User Genera Table (Many-to-Many)
export const userGenera = pgTable("user_genera", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  generaId: integer("genera_id").references(() => genera.id),
});

// Articles Table
export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  url: text("url").notNull(),
  generaId: integer("genera_id").references(() => genera.id),
  fetchedAt: text("fetched_at").default(new Date().toISOString()),
});
