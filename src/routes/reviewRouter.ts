import { Router } from 'express';
import { ReviewController } from '../controllers/reviewController.ts';
import { authenticateToken, authorizeRole } from '../utils/auth.ts';
import { validateRequest } from '../utils/validate.ts';
import { idParamSchema } from '../dtos/validationSchema.ts';

const reviewRouter = Router();
const reviewController = new ReviewController();

reviewRouter.get('/', (req, res) => {
  // #swagger.responses[200] = { description: 'Daftar review' }
  return reviewController.getReviews(req, res);
});

reviewRouter.delete(
  '/:id',
  authenticateToken,
  authorizeRole('admin'),
  validateRequest(idParamSchema, 'params'),
  (req, res) => {
    // #swagger.security = [{ "BearerAuth": [] }]
    // #swagger.autoHeaders = false
    // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
    // #swagger.responses[200] = { description: 'Review terhapus' }
    // #swagger.responses[401] = { description: 'Token tidak ditemukan atau tidak valid' }
    // #swagger.responses[403] = { description: 'Hanya admin yang boleh menghapus' }
    // #swagger.responses[404] = { description: 'Tidak ditemukan' }
    return reviewController.deleteReview(req, res);
  },
);

export { reviewRouter };