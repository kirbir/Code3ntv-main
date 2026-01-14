import express from "express";

import {
  registerController,
  loginController,
  getProfileController,
  updateProfileController,
  deleteAccountController,
} from "../controllers/userController.js";

import { validate } from "../middleware/validate.js";
import { authenticate } from "../middleware/auth.js";
import {
  registerSchema,
  loginSchema,
  updateUserSchema,
} from "../schemas/userSchema.js";

const router = express.Router();

// Public routes
router.post("/register", validate(registerSchema), registerController);
router.post("/login", validate(loginSchema), loginController);

// Protected routes
router.get("/profile", authenticate, getProfileController);
router.put(
  "/profile",
  authenticate,
  validate(updateUserSchema),
  updateProfileController
);
router.delete("/profile", authenticate, deleteAccountController);

export default router;
