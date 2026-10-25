import type { Response } from 'express';
import { LikeService } from '../services/likeService.ts';
import type { AuthRequest } from '../utils/auth.ts';
import { sendError } from '../utils/errors.ts';

export class LikeController {
  private service = new LikeService();

  async createLike(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res
          .status(401)
          .json({ status: 'fail', message: 'Anda belum login' });
      }

      const data = await this.service.createLike({
        reviewId: req.body.reviewId,
        userId: req.user.id, // dari token, bukan body
      });

      return res.status(201).json({
        status: 'success',
        message: 'Like berhasil ditambahkan',
        data,
      });
    } catch (error) {
      return sendError(res, error);
    }
  }

  async deleteLike(req: AuthRequest, res: Response) {
    try {
      const data = await this.service.deleteLike(Number(req.params.id));

      if (!data) {
        return res
          .status(404)
          .json({ status: 'fail', message: 'Like tidak ditemukan' });
      }

      return res.json({
        status: 'success',
        message: 'Like berhasil dihapus',
        data,
      });
    } catch (error) {
      return sendError(res, error);
    }
  }
}