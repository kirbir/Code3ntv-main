import express, { type Request, type Response, type NextFunction } from 'express';
import fs from 'fs/promises';
import path from 'path';
import {loadArticles} from "../service/arcticlesService.js"
import { fileURLToPath } from 'url';
import { validate } from '../middleware/validate.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const articlesFilePath = path.join(__dirname, '../data/articles.json');

/// Get all articles from file
router.get('/', async (req: Request, res: Response) => {
  const articles = await loadArticles();
  console.log('articles get route hit, trying to run getArticles function');
  res.json({ success: true, data: articles });
});

router.get('/:id', async (req: Request, res: Response) => {
  res.json({ success: true, message: 'Article fetched successfully' });
});

router.post('/', async (req:Request, res: Response) => {

})

export default router;
