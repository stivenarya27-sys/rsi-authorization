import type { Request, Response } from 'express';
import { AuditService } from '../services/auditService.ts';
import type { AuthRequest } from '../utils/auth.ts';
import { sendError } from '../utils/errors.ts';

export class AuditController {
  private service = new AuditService();

  async getAudits(req: Request, res: Response) {
    try {
      const data = await this.service.getAudits();

      return res.json({
        status: 'success',
        message: 'Daftar audit log',
        data,
      });
    } catch (error) {
      return sendError(res, error);
    }
  }

  async createAudit(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res
          .status(401)
          .json({ status: 'fail', message: 'Anda belum login' });
      }

      const data = await this.service.createAudit({
        userId: req.user.id, // dari token, bukan body
        action: req.body.action,
        targetTable: req.body.targetTable,
        targetId: req.body.targetId,
        metadata: req.body.metadata,
      });

      return res.status(201).json({
        status: 'success',
        message: 'Audit log berhasil ditambahkan',
        data,
      });
    } catch (error) {
      return sendError(res, error);
    }
  }
}