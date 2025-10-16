import { z } from 'zod';

export const AddArticleRequest = z.object({
    article: z.string().min(3).max(255),
});

export const ArticlesQuery = z.object({
    page: z.number().min(1).optional(),
    limit: z.number().min(1).optional()
});

export const UUIDParams = z.object({
    id:z.string().uuid('Invalid ID Format')
});

export const PatchArticles = z.object({
    
})