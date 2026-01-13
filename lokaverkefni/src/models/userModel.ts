import db from "../../../skilaverkefni3/src/config/db.js";
import * as bcrypt from "bcrypt";
import { cancelFutureBookings } from "./bookingModel.js";

export interface User {
  id?: number;
  email: string;
  password_hash?: string;
  role: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface UserWithoutPassword {
  id: number;
  email: string;
  role: string;
  created_at?: Date;
  updated_at?: Date;
}

export const createUser = async (
  email: string,
  password: string
): Promise<UserWithoutPassword> => {
  // Hash password
  const saltRounds = 10;
  const password_hash = await bcrypt.hash(password, saltRounds);

  // Insert user
  const user = await db.one(
    `INSERT INTO users (email, password_hash, role)
         VALUES ($1, $2, $3)
         RETURNING id, email, role, created_at, updated_at`,
    [email, password_hash, "user"]
  );

  return user;
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  const user = await db.oneOrNone(
    `SELECT id, email, password_hash, role, created_at, updated_at
       FROM users
       WHERE email = $1`,
    [email]
  );
  return user;
};

export const getUserById = async (
  id: number
): Promise<UserWithoutPassword | null> => {
  const user = await db.oneOrNone(
    `SELECT id, email, role, created_at, updated_at
       FROM users
       WHERE id = $1`,
    [id]
  );
  return user;
};

export const verifyPassword = async (
  password: string,
  password_hash: string
): Promise<boolean> => {
  return await bcrypt.compare(password, password_hash);
};

export const updateUser = async (
  id: number,
  email?: string
): Promise<UserWithoutPassword> => {
  const updates: string[] = [];
  const values: any[] = [];
  let paramCount = 1;

  if (email !== undefined) {
    updates.push(`email = $${paramCount++}`);
    values.push(email);
  }

  updates.push(`updated_at = NOW()`);
  values.push(id);

  const user = await db.one(
    `UPDATE users
       SET ${updates.join(", ")}
       WHERE id = $${paramCount}
       RETURNING id, email, role, created_at, updated_at`,
    values
  );

  return user;
};

export const deleteUser = async (id: number): Promise<void> => {
  await cancelFutureBookings(id);
  await db.none(`DELETE FROM users WHERE id = $1`, [id]);
};
