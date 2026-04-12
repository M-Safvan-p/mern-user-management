import express from "express";
import {
  loginAdmin,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/adminController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", loginAdmin);
router.get("/users", protect, adminOnly, getAllUsers);
router.post("/users", protect, adminOnly, createUser);
router.put("/users/:id", protect, adminOnly, updateUser);
router.delete("/users/:id", protect, adminOnly, deleteUser);

export default router;