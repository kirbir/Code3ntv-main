import express, { Request, Response, NextFunction } from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { validate, validateParams, validateQuery } from "../middleware/validate";
import { addAuthor, loadAuthorsPaginatedAsync, AuthorsResponse, deleteAuthor } from '../service/authorsService.js';
import { loadArticlesPaginatedAsync } from '../service/arcticlesService.js';
import { UUIDParams, AddAuthorRequest,AuthorsQuery } from '../schemas/authorsSchema.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const authorsFilePath = path.join(__dirname, '../data/authors.json');
const articlesFilePath = path.join(__dirname, '../data/articles.json');


/// GET ARTICLES BY AUTHOR
router.get('/:id/articles', async (request, response, next:NextFunction) => {
const {id} = request.params;

const articles = await loadArticlesPaginatedAsync(articlesFilePath);
});

/// GET AUTHORS BY ID ENDPOINT
router.get(
  '/:id',
  validateParams(UUIDParams),
  async (request, response, next: NextFunction) => {
    const { id } = request.params;

    const authors = await loadAuthorsPaginatedAsync(authorsFilePath);
    const author = authors.find((movie: AuthorsResponse) => {
      return movie.id === id;
    });

    if (!author) {
      response.status(404).json({ success: false, error: 'Author not found.' });
      return;
    }

    response.status(200).json({ success: true, data: author });
  }
);

/// GET ALL ARTICLES ENDPOINT
router.get('/', validateQuery(AuthorsQuery), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const articles = await loadAuthorsPaginatedAsync(authorsFilePath);
    console.log('articles get route hit, trying to run getArticles function');
    res.json({ success: true, data: articles });
  } catch (error) {
    next(error);
  }
});

/// CREATE NEW ARTICLE ENDPOINT
router.post('/', validate(AddAuthorRequest), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, content, authorId } = req.body;
    const createdArticle = await addAuthor(title, content, authorId);
    res.status(201).json({ success: true, data: createdArticle });

  } catch (error) {
    next(error);
  }
});

/// DELETE ARTICLE BY ID ENDPOINT
router.delete('/:id', validateParams(UUIDParams), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await deleteAuthor(id);
    res.status(200
    ).send('Author deleted successfully');

  } catch (error) {
    next(error);
  }
});


export default router;
