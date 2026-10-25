import { Router } from 'express';
import { StallController } from '../controllers/stallController.ts';
import { ReviewController } from '../controllers/reviewController.ts';
import { authenticateToken, authorizeRole } from '../utils/auth.ts';
import { validateRequest } from '../utils/validate.ts';
import {
  idParamSchema,
  getStallsQuerySchema,
  createStallSchema,
  updateStallSchema,
  createReviewSchema,
} from '../dtos/validationSchema.ts';

const stallRouter = Router();
const stallController = new StallController();
const reviewController = new ReviewController();

stallRouter.get(
  '/',
  validateRequest(getStallsQuerySchema, 'query'),
  (req, res) => {
    // #swagger.parameters['search'] = { in: 'query', type: 'string' }
    // #swagger.parameters['category'] = { in: 'query', type: 'string' }
    // #swagger.parameters['page'] = { in: 'query', type: 'integer' }
    // #swagger.parameters['limit'] = { in: 'query', type: 'integer' }
    // #swagger.responses[200] = { description: 'Daftar warung' }
    // #swagger.responses[400] = { description: 'Validasi gagal' }
    return stallController.getStalls(req, res);
  },
);

stallRouter.post(
  '/',
  authenticateToken,
  authorizeRole('admin', 'owner'),
  validateRequest(createStallSchema, 'body'),
  (req, res) => {
    // #swagger.security = [{ "BearerAuth": [] }]
    // #swagger.autoHeaders = false
    // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/StallInput' } }
    // #swagger.responses[201] = { description: 'Warung dibuat' }
    // #swagger.responses[400] = { description: 'Validasi gagal' }
    // #swagger.responses[401] = { description: 'Token tidak ditemukan atau tidak valid' }
    // #swagger.responses[403] = { description: 'Role tidak memiliki izin' }
    return stallController.createStall(req, res);
  },
);

stallRouter.get(
  '/:id',
  validateRequest(idParamSchema, 'params'),
  (req, res) => {
    // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
    // #swagger.responses[200] = { description: 'Detail warung' }
    // #swagger.responses[400] = { description: 'Validasi gagal' }
    // #swagger.responses[404] = { description: 'Tidak ditemukan' }
    return stallController.getStallById(req, res);
  },
);

stallRouter.put(
  '/:id',
  authenticateToken,
  authorizeRole('admin', 'owner'),
  validateRequest(idParamSchema, 'params'),
  validateRequest(updateStallSchema, 'body'),
  (req, res) => {
    // #swagger.security = [{ "BearerAuth": [] }]
    // #swagger.autoHeaders = false
    // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
    // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/StallInput' } }
    // #swagger.responses[200] = { description: 'Warung ter-update' }
    // #swagger.responses[400] = { description: 'Validasi gagal' }
    // #swagger.responses[401] = { description: 'Token tidak ditemukan atau tidak valid' }
    // #swagger.responses[403] = { description: 'Bukan role yang diizinkan atau bukan pemilik warung' }
    // #swagger.responses[404] = { description: 'Tidak ditemukan' }
    return stallController.updateStall(req, res);
  },
);

stallRouter.delete(
  '/:id',
  authenticateToken,
  authorizeRole('admin'),
  validateRequest(idParamSchema, 'params'),
  (req, res) => {
    // #swagger.security = [{ "BearerAuth": [] }]
    // #swagger.autoHeaders = false
    // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
    // #swagger.responses[200] = { description: 'Warung terhapus' }
    // #swagger.responses[400] = { description: 'Validasi gagal' }
    // #swagger.responses[401] = { description: 'Token tidak ditemukan atau tidak valid' }
    // #swagger.responses[403] = { description: 'Hanya admin yang boleh menghapus' }
    // #swagger.responses[404] = { description: 'Tidak ditemukan' }
    return stallController.deleteStall(req, res);
  },
);

stallRouter.get(
  '/:id/menus',
  validateRequest(idParamSchema, 'params'),
  (req, res) => {
    // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
    // #swagger.responses[200] = { description: 'Daftar menu' }
    // #swagger.responses[400] = { description: 'Validasi gagal' }
    // #swagger.responses[404] = { description: 'Tidak ditemukan' }
    return stallController.getStallMenus(req, res);
  },
);

stallRouter.post(
  '/:id/reviews',
  authenticateToken,
  validateRequest(idParamSchema, 'params'),
  validateRequest(createReviewSchema, 'body'),
  (req, res) => {
    // #swagger.security = [{ "BearerAuth": [] }]
    // #swagger.autoHeaders = false
    // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
    // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/ReviewInput' } }
    // #swagger.responses[201] = { description: 'Review ditambahkan' }
    // #swagger.responses[400] = { description: 'Validasi gagal' }
    // #swagger.responses[401] = { description: 'Token tidak ditemukan atau tidak valid' }
    // #swagger.responses[404] = { description: 'Warung tidak ditemukan' }
    return reviewController.createReview(req, res);
  },
);

export { stallRouter };