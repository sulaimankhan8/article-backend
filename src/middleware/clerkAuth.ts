import { requireAuth } from "@clerk/express";
import { Request, Response, NextFunction } from "express";

// Extend Express Request type to include auth
declare module "express" {
  interface Request {
    auth?: { userId: string };
  }
}

const clerkAuth = requireAuth();

export default clerkAuth;
