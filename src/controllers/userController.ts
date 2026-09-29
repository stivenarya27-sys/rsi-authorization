import type { Request, Response } from 'express';
import { UserService } from '../services/userService.ts';
import type { Role } from '../repositories/userRepository.ts';
import { sendError } from '../utils/errors.ts';

export class UserController {
  private service: UserService;

  constructor(service: UserService = new UserService()) {
    this.service = service;
  }

  getUsers = async (req: Request, res: Response): Promise<Response> => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const role = typeof req.query.role === 'string' ? (req.query.role as Role) : undefined;
      const { rows, total } = await this.service.getAll({ role, page, limit });
      return res.status(200).json({ status: 'success', meta: { page, limit, total }, data: rows });
    } catch (error) {
      return sendError(res, error);
    }
  };

  createUser = async (req: Request, res: Response): Promise<Response> => {
    try {
      const user = await this.service.create(req.body ?? {});
      return res.status(201).json({ status: 'success', data: user });
    } catch (error) {
      return sendError(res, error);
    }
  };
}