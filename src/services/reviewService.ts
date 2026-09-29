import { ReviewRepository, ReviewInput } from '../repositories/reviewRepository.ts';

export class ReviewService {
  private repository = new ReviewRepository();

  async getReviews() {
    return this.repository.findAll();
  }

  async createReview(input: ReviewInput) {
    return this.repository.create(input);
  }

  async deleteReview(id: number) {
    return this.repository.remove(id);
  }
}