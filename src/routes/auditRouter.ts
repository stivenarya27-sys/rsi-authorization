import { Router } from 'express';
import { AuditController } from '../controllers/auditController.ts';

const auditRouter = Router();

const auditController = new AuditController();

auditRouter.get('/', (req, res) => {
  return auditController.getAudits(req, res);
});

auditRouter.post('/', (req, res) => {
  return auditController.createAudit(req, res);
});

export { auditRouter };