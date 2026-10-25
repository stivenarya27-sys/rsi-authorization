import { z } from 'zod';

// Validasi ID pada parameter URL
export const idParamSchema = z.object({
  id: z.coerce.number().int().positive('ID harus berupa bilangan positif'),
});

// Validasi query GET /stalls
export const getStallsQuerySchema = z.object({
  search: z.string().trim().max(100).optional(),
  category: z.string().trim().max(50).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

// Validasi pembuatan warung
export const createStallSchema = z.object({
  name: z.string().trim().min(3, 'Nama minimal 3 karakter').max(100),
  category: z.string().trim().max(50).optional(),
  location: z.string().trim().max(100).optional(),
  description: z.string().trim().max(1000).optional(),
});

// Validasi update warung: semua field opsional
export const updateStallSchema = createStallSchema.partial();

// Validasi register
export const registerSchema = z.object({
  name: z.string().trim().min(3, 'Nama minimal 3 karakter').max(100),
  email: z.email().trim().toLowerCase().max(150),
  password: z.string().min(8, 'Password minimal 8 karakter').max(72),
});

// Validasi login
export const loginSchema = z.object({
  email: z.email().trim().toLowerCase().max(150),
  password: z.string().min(1, 'Password wajib diisi'),
});

// Validasi review
export const createReviewSchema = z.object({
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().trim().max(1000).optional(),
});