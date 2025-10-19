import express, { type Request, type Response, type NextFunction } from 'express';
import { validateParams, validateQuery } from "../middleware/validate";
import path from 'path';
import { loadArticlesPaginatedAsync, ArticlesResponse, addArticle, deleteArticle } from "../service/arcticlesService.js"
import { fileURLToPath } from 'url';
import { validate } from '../middleware/validate.js';
import { AddArticleRequest, ArticlesQuery, UUIDParams } from '../schemas/arcticlesSchema.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const articlesFilePath = path.join(__dirname, '../data/articles.json');

/// GET ARTICLES BY ID ENDPOINT
router.get(
  '/:id',
  validateParams(UUIDParams),
  async (request, response, next: NextFunction) => {
    const { id } = request.params;

    const articles = await loadArticlesPaginatedAsync(articlesFilePath);
    const article = articles.find((movie: ArticlesResponse) => {
      return movie.id === id;
    });

    if (!article) {
      response.status(404).json({ success: false, error: 'Article not found.' });
      return;
    }

    response.status(200).json({ success: true, data: article });
  }
);

/// GET ALL ARTICLES ENDPOINT
router.get('/', validateQuery(ArticlesQuery), async (req: Request, res: Response, next:NextFunction) => {
try {
  const articles = await loadArticlesPaginatedAsync(articlesFilePath);
  console.log('articles get route hit, trying to run getArticles function');
  res.json({ success: true, data: articles });
} catch (error) {
  next(error);
}
});

/// CREATE NEW ARTICLE ENDPOINT
router.post('/', validate(AddArticleRequest), async (req: Request, res: Response, next:NextFunction) => {
  try {
    const { title, content, authorId } = req.body;
    const createdArticle = await addArticle(title, content, authorId);
    res.status(201).json({ success: true, data: createdArticle });

  } catch (error) {
    next(error);
  }
});

/// DELETE ARTICLE BY ID ENDPOINT
router.delete('/:id', validateParams(UUIDParams), async (req: Request, res:Response, next:NextFunction) => {
  try {
    const {id} = req.params;
    await deleteArticle(id);
    res.status(200
    ).send('Article deleted successfully');

  } catch (error) {
    next(error);
  }
});

export default router;
