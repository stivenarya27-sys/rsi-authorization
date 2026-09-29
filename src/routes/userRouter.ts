import { Router } from 'express';
import { UserController } from '../controllers/userController.ts';

const userRouter = Router();
const userController = new UserController();

userRouter.get('/', (req, res) => {
  // #swagger.parameters['role']  = { in: 'query', type: 'string' }
  // #swagger.parameters['page']  = { in: 'query', type: 'integer' }
  // #swagger.parameters['limit'] = { in: 'query', type: 'integer' }
  // #swagger.responses[200] = { description: 'Daftar user' }
  return userController.getUsers(req, res);
});

userRouter.post('/', (req, res) => {
  // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/UserInput' } }
  // #swagger.responses[201] = { description: 'User dibuat' }
  // #swagger.responses[409] = { description: 'Email sudah terdaftar' }
  return userController.createUser(req, res);
});

export { userRouter };