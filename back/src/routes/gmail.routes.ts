import { Router } from "express";
import {
  getAuthUrl,
  redirectToGoogleAuth,
  handleGoogleCallback,
} from "../controllers/gmail.controller";

const router = Router();

router.get("/auth-url", getAuthUrl);
router.get("/connect", redirectToGoogleAuth);
router.get("/callback", handleGoogleCallback);

export default router;