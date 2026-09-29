import type { Request, Response } from 'express';
import { MenuItemService } from '../services/menuItemService.ts';
import { sendError } from '../utils/errors.ts';

export class MenuItemController {
  private service: MenuItemService;

  constructor(service: MenuItemService = new MenuItemService()) {
    this.service = service;
  }

  getAll = async (req: Request, res: Response): Promise<Response> => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const stallId = req.query.stallId ? Number(req.query.stallId) : undefined;
      const { rows, total } = await this.service.getAll({ stallId, page, limit });
      return res.status(200).json({ status: 'success', meta: { page, limit, total }, data: rows });
    } catch (error) {
      return sendError(res, error);
    }
  };

  getById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const data = await this.service.getById(Number(req.params.id));
      return res.status(200).json({ status: 'success', data });
    } catch (error) {
      return sendError(res, error);
    }
  };

  create = async (req: Request, res: Response): Promise<Response> => {
    try {
      const data = await this.service.create(req.body ?? {});
      return res.status(201).json({ status: 'success', data });
    } catch (error) {
      return sendError(res, error);
    }
  };

  update = async (req: Request, res: Response): Promise<Response> => {
    try {
      const data = await this.service.update(Number(req.params.id), req.body ?? {});
      return res.status(200).json({ status: 'success', data });
    } catch (error) {
      return sendError(res, error);
    }
  };

  remove = async (req: Request, res: Response): Promise<Response> => {
    try {
      const data = await this.service.remove(Number(req.params.id));
      return res.status(200).json({ status: 'success', data });
    } catch (error) {
      return sendError(res, error);
    }
  };
}