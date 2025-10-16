import express, { Request, Response, NextFunction } from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { validate } from '../middleware/validate.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const authorsFilePath = path.join(__dirname, '../data/authors.json');

router.get('/', async (req: Request, res: Response) => {
  res.json({ success: true, message: 'Authors fetched successfully' });
});

router.get('/:id', async (req: Request, res: Response) => {
  res.json({ success: true, message: 'Author fetched successfully' });
});
export default router;
