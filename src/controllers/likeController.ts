import { Request, Response } from 'express';
import { LikeService } from '../services/likeService.ts';

export class LikeController {
  private service = new LikeService();

  async createLike(req: Request, res: Response) {
    const data = await this.service.createLike({
      reviewId: Number(req.body.reviewId),
      userId: Number(req.body.userId),
    });

    return res.status(201).json({
      status: 'success',
      message: 'Like berhasil ditambahkan',
      data,
    });
  }

  async deleteLike(req: Request, res: Response) {
    const id = Number(req.params.id);

    const data = await this.service.deleteLike(id);

    if (!data) {
      return res.status(404).json({
        status: 'error',
        message: 'Like tidak ditemukan',
      });
    }

    return res.json({
      status: 'success',
      message: 'Like berhasil dihapus',
      data,
    });
  }
}