import { Router } from 'express';
import { MenuItemController } from '../controllers/menuItemController.ts';

const menuItemRouter = Router();
const controller = new MenuItemController();

menuItemRouter.get('/', (req, res) => {
  // #swagger.parameters['stallId'] = { in: 'query', type: 'integer' }
  // #swagger.parameters['page']    = { in: 'query', type: 'integer' }
  // #swagger.parameters['limit']   = { in: 'query', type: 'integer' }
  // #swagger.responses[200] = { description: 'Daftar menu + nama warung (JOIN)' }
  return controller.getAll(req, res);
});

menuItemRouter.get('/:id', (req, res) => {
  // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
  // #swagger.responses[404] = { description: 'Tidak ditemukan' }
  return controller.getById(req, res);
});

menuItemRouter.post('/', (req, res) => {
  // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/MenuItemInput' } }
  // #swagger.responses[201] = { description: 'Menu dibuat' }
  return controller.create(req, res);
});

menuItemRouter.put('/:id', (req, res) => {
  // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
  // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/MenuItemInput' } }
  // #swagger.responses[404] = { description: 'Tidak ditemukan' }
  return controller.update(req, res);
});

menuItemRouter.delete('/:id', (req, res) => {
  // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
  // #swagger.responses[404] = { description: 'Tidak ditemukan' }
  return controller.remove(req, res);
});

export { menuItemRouter };