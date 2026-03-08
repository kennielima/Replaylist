import express from "express";
import { callback, login, logout, googleLogin, googleCallback } from "../controllers/auth.controllers";

const router = express.Router();

router.get("/spotify/login", login)
router.get("/spotify/callback", callback)
router.get("/spotify/logout", logout)
router.get("/google/login", googleLogin)
router.get("/google/callback", googleCallback)

export default router;