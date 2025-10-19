import { z } from 'zod';

export const AddAuthorRequest = z.object({
    name: z.string().min(3).max(100, 'Title can not exceed 100 characters.'),
    email: z.string().email('Invalid E-mail format'),
    bio: z.number().int().positive('authorId should be positive number!')
});

export const AuthorsQuery = z.object({
    page: z.number().min(1).optional(),
    limit: z.number().min(1).optional()
});

export const UUIDParams = z.object({
    id:z.string().uuid('Invalid ID Format')
});