import { Request, Response } from 'express';
import { ReviewService } from '../services/reviewService.ts';

export class ReviewController {
  private service = new ReviewService();

  async getReviews(req: Request, res: Response) {
    const data = await this.service.getReviews();

    return res.json({
      status: 'success',
      message: 'Daftar review',
      data,
    });
  }

  async createReview(req: Request, res: Response) {
    const data = await this.service.createReview({
      stallId: Number(req.body.stallId),
      userId: Number(req.body.userId),
      rating: Number(req.body.rating),
      comment: req.body.comment,
    });

    return res.status(201).json({
      status: 'success',
      message: 'Review berhasil ditambahkan',
      data,
    });
  }

  async deleteReview(req: Request, res: Response) {
    const id = Number(req.params.id);

    const data = await this.service.deleteReview(id);

    if (!data) {
      return res.status(404).json({
        status: 'error',
        message: 'Review tidak ditemukan',
      });
    }

    return res.json({
      status: 'success',
      message: 'Review berhasil dihapus',
      data,
    });
  }
}