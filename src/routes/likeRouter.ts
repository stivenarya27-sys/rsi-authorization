import { Router } from 'express';
import { LikeController } from '../controllers/likeController.ts';
import { authenticateToken } from '../utils/auth.ts';
import { validateRequest } from '../utils/validate.ts';
import { createLikeSchema, idParamSchema } from '../dtos/validationSchema.ts';

const likeRouter = Router();
const likeController = new LikeController();

likeRouter.post(
  '/',
  authenticateToken,
  validateRequest(createLikeSchema, 'body'),
  (req, res) => {
    // #swagger.security = [{ "BearerAuth": [] }]
    // #swagger.autoHeaders = false
    // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/LikeInput' } }
    // #swagger.responses[201] = { description: 'Like ditambahkan' }
    // #swagger.responses[400] = { description: 'Validasi gagal' }
    // #swagger.responses[401] = { description: 'Token tidak ditemukan atau tidak valid' }
    return likeController.createLike(req, res);
  },
);

likeRouter.delete(
  '/:id',
  authenticateToken,
  validateRequest(idParamSchema, 'params'),
  (req, res) => {
    // #swagger.security = [{ "BearerAuth": [] }]
    // #swagger.autoHeaders = false
    // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
    // #swagger.responses[200] = { description: 'Like terhapus' }
    // #swagger.responses[401] = { description: 'Token tidak ditemukan atau tidak valid' }
    // #swagger.responses[404] = { description: 'Tidak ditemukan' }
    return likeController.deleteLike(req, res);
  },
);

export { likeRouter };