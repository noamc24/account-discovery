import { Router } from "express";
import { scanEmail } from "../controllers/scan.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

router.post("/", protect, scanEmail);

export default router;