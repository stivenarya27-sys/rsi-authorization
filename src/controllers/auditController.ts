import { Request, Response } from 'express';
import { AuditService } from '../services/auditService.ts';

export class AuditController {
  private service = new AuditService();

  async getAudits(req: Request, res: Response) {
    const data = await this.service.getAudits();

    return res.json({
      status: 'success',
      message: 'Daftar audit log',
      data,
    });
  }

  async createAudit(req: Request, res: Response) {
    const data = await this.service.createAudit({
      userId: Number(req.body.userId),
      action: req.body.action,
      targetTable: req.body.targetTable,
      targetId: Number(req.body.targetId),
      metadata: req.body.metadata,
    });

    return res.status(201).json({
      status: 'success',
      message: 'Audit log berhasil ditambahkan',
      data,
    });
  }
}