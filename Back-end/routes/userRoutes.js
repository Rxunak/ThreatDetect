import express from "express";
import { registerUser, loginUser, getUsersId, blockUser, unblockUser } from "../controllers/userController.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/signup", registerUser);
router.get("/users", getUsersId)
router.patch("/block/:userId", blockUser);
router.patch("/unblock/:userId", unblockUser);

export default router;
