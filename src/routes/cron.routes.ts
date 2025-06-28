import { Router } from "express";
import { authenticateMiddleware } from "../middlewares/auth";
import { checkRoleMiddleware } from "../middlewares/checkRole";
import {
  getCronStatus,
  triggerNotificationCleanup,
} from "../controllers/cron.controller";

const cronRouter = Router();

// Cron monitoring routes (admin only)
cronRouter.get("/status", authenticateMiddleware, checkRoleMiddleware, getCronStatus);
cronRouter.post("/trigger-cleanup", authenticateMiddleware, checkRoleMiddleware, triggerNotificationCleanup);

export default cronRouter; 