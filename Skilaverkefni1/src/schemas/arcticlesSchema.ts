import { z } from 'zod';

export const AddArticleRequest = z.object({
    title: z.string().min(3).max(255, 'Title can not exceed 255 characters.'),
    content: z.string().min(10, 'Content must have minimum 10 characters.'),
    authorId: z.string().uuid('Invalid ID Format')
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