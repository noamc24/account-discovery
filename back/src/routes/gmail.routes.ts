import express from "express";
import {
  connectGmail,
  gmailCallback,
  getGmailMessages,
  scanGmailAccounts,
} from "../controllers/gmail.controller";

const router = express.Router();

router.get("/connect", connectGmail);
router.get("/callback", gmailCallback);
router.get("/messages", getGmailMessages);
router.get("/scan", scanGmailAccounts);

export default router;