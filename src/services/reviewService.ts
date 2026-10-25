import {
  ReviewRepository,
  type ReviewInput,
} from '../repositories/reviewRepository.ts';
import { StallRepository } from '../repositories/stallRepository.ts';
import { AppError } from '../utils/errors.ts';

export class ReviewService {
  private repository = new ReviewRepository();
  private stallRepository = new StallRepository();

  async getReviews() {
    return this.repository.findAll();
  }

  async createReview(input: ReviewInput) {
    const stall = await this.stallRepository.findById(input.stallId);
    if (!stall) throw new AppError(404, 'Data warung tidak ditemukan');

    return this.repository.create(input);
  }

  async deleteReview(id: number) {
    return this.repository.remove(id);
  }
}