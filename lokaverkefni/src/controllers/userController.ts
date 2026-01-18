import type { Request, Response, NextFunction } from "express";
import {
  createUser,
  getUserByEmail,
  getUserById,
  verifyPassword,
  updateUser,
  deleteUser,
} from "../models/userModel.js";
import { generateToken } from "../utils/jwt.js";
import {
  AppError,
  ConflictError,
  UnauthorizedError,
} from "../middleware/errorHandler.js";

export const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      throw new ConflictError("Email already registered");
    }

    // Create user
    const user = await createUser(email, password);

    // Generate token
    const token = generateToken({
      userId: user.id!,
      email: user.email,
      role: user.role,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await getUserByEmail(email);
    if (!user || !user.password_hash) {
      throw new UnauthorizedError("Invalid email or password");
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password_hash);
    if (!isValidPassword) {
      throw new UnauthorizedError("Invalid email or password");
    }

    // Generate token
    const token = generateToken({
      userId: user.id!,
      email: user.email,
      role: user.role,
    });

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const getProfileController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new UnauthorizedError("User not authenticated");
    }

    const user = await getUserById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const updateProfileController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new UnauthorizedError("User not authenticated");
    }

    const { email } = req.body;

    // Check if email is already taken by another user
    if (email) {
      const existingUser = await getUserByEmail(email);
      if (existingUser && existingUser.id !== userId) {
        throw new ConflictError("Email already in use");
      }
    }

    const updatedUser = await updateUser(userId, email);

    res.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAccountController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new UnauthorizedError("User not authenticated");
    }

    await deleteUser(userId);

    res.json({
      message: "Account deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
