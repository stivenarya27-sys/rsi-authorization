import type { Request, Response } from 'express';
import { ReviewService } from '../services/reviewService.ts';
import type { AuthRequest } from '../utils/auth.ts';
import { sendError } from '../utils/errors.ts';

export class ReviewController {
  private service = new ReviewService();

  async getReviews(req: Request, res: Response) {
    try {
      const data = await this.service.getReviews();
      return res.json({ status: 'success', message: 'Daftar review', data });
    } catch (error) {
      return sendError(res, error);
    }
  }

  async createReview(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res
          .status(401)
          .json({ status: 'fail', message: 'Anda belum login' });
      }

      const data = await this.service.createReview({
        stallId: Number(req.params.id), // dari params
        userId: req.user.id, // dari token, bukan body
        rating: req.body.rating,
        comment: req.body.comment,
      });

      return res.status(201).json({
        status: 'success',
        message: 'Review berhasil ditambahkan',
        data,
      });
    } catch (error) {
      return sendError(res, error);
    }
  }

  async deleteReview(req: Request, res: Response) {
    try {
      const data = await this.service.deleteReview(Number(req.params.id));

      if (!data) {
        return res
          .status(404)
          .json({ status: 'fail', message: 'Review tidak ditemukan' });
      }

      return res.json({
        status: 'success',
        message: 'Review berhasil dihapus',
        data,
      });
    } catch (error) {
      return sendError(res, error);
    }
  }
}