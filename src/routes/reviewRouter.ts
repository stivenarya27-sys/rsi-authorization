import { Router } from 'express';
import { ReviewController } from '../controllers/reviewController.ts';

const reviewRouter = Router();

const reviewController = new ReviewController();

reviewRouter.get('/', (req, res) => {
  return reviewController.getReviews(req, res);
});

reviewRouter.post('/', (req, res) => {
  return reviewController.createReview(req, res);
});

reviewRouter.delete('/:id', (req, res) => {
  return reviewController.deleteReview(req, res);
});

export { reviewRouter };