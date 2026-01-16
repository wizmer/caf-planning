import z from 'zod/v3';

export const gymSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	description: z.string().max(500, 'Description must be at most 500 characters').optional()
});
