import { Router } from 'express';
import { LikeController } from '../controllers/likeController.ts';

const likeRouter = Router();

const likeController = new LikeController();

likeRouter.post('/', (req, res) => {
  return likeController.createLike(req, res);
});

likeRouter.delete('/:id', (req, res) => {
  return likeController.deleteLike(req, res);
});

export { likeRouter };