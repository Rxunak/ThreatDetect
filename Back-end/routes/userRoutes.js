import express from "express";
import { registerUser, loginUser, getUsersId, blockUser, unblockUser, deleteUser } from "../controllers/userController.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/signup", registerUser);
router.get("/users", getUsersId)
router.patch("/block/:userId", blockUser);
router.patch("/unblock/:userId", unblockUser);
router.delete("/:userId", deleteUser);

export default router;
