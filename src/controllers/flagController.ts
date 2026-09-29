import { Request, Response } from 'express';
import { FlagService } from '../services/flagService.ts';

export class FlagController {
  private service = new FlagService();

  async getFlags(req: Request, res: Response) {
    const data = await this.service.getFlags();

    return res.json({
      status: 'success',
      message: 'Daftar flag',
      data,
    });
  }

  async updateFlag(req: Request, res: Response) {
    const id = Number(req.params.id);

    const data = await this.service.updateFlag(id, {
      status: req.body.status,
    });

    if (!data) {
      return res.status(404).json({
        status: 'error',
        message: 'Flag tidak ditemukan',
      });
    }

    return res.json({
      status: 'success',
      message: 'Status flag berhasil diperbarui',
      data,
    });
  }
}