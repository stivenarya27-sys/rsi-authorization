import { Router } from 'express';
import { FlagController } from '../controllers/flagController.ts';

const flagRouter = Router();

const flagController = new FlagController();

flagRouter.get('/', (req, res) => {
  return flagController.getFlags(req, res);
});

flagRouter.put('/:id', (req, res) => {
  return flagController.updateFlag(req, res);
});

export { flagRouter };