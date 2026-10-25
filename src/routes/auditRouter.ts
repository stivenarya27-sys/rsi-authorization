import { Router } from 'express';
import { AuditController } from '../controllers/auditController.ts';
import { authenticateToken, authorizeRole } from '../utils/auth.ts';
import { validateRequest } from '../utils/validate.ts';
import { createAuditSchema } from '../dtos/validationSchema.ts';

const auditRouter = Router();
const auditController = new AuditController();

auditRouter.get(
  '/',
  authenticateToken,
  authorizeRole('admin'),
  (req, res) => {
    // #swagger.security = [{ "BearerAuth": [] }]
    // #swagger.autoHeaders = false
    // #swagger.responses[200] = { description: 'Daftar audit log' }
    // #swagger.responses[401] = { description: 'Token tidak ditemukan atau tidak valid' }
    // #swagger.responses[403] = { description: 'Hanya admin' }
    return auditController.getAudits(req, res);
  },
);

auditRouter.post(
  '/',
  authenticateToken,
  authorizeRole('admin'),
  validateRequest(createAuditSchema, 'body'),
  (req, res) => {
    // #swagger.security = [{ "BearerAuth": [] }]
    // #swagger.autoHeaders = false
    // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/AuditInput' } }
    // #swagger.responses[201] = { description: 'Audit log ditambahkan' }
    // #swagger.responses[400] = { description: 'Validasi gagal' }
    // #swagger.responses[401] = { description: 'Token tidak ditemukan atau tidak valid' }
    // #swagger.responses[403] = { description: 'Hanya admin' }
    return auditController.createAudit(req, res);
  },
);

export { auditRouter };