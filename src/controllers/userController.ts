import type { Request, Response } from 'express';
import { UserService } from '../services/userService.ts';
import type { Role } from '../repositories/userRepository.ts';
import type { AuthRequest } from '../utils/auth.ts';
import { sendError } from '../utils/errors.ts';

export class UserController {
  private service: UserService;

  constructor(service: UserService = new UserService()) {
    this.service = service;
  }

  // GET USERS
  getUsers = async (req: Request, res: Response): Promise<Response> => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const role =
        typeof req.query.role === 'string'
          ? (req.query.role as Role)
          : undefined;

      const { rows, total } = await this.service.getAll({
        role,
        page,
        limit,
      });

      return res.status(200).json({
        status: 'success',
        meta: {
          page,
          limit,
          total,
        },
        data: rows,
      });
    } catch (error) {
      return sendError(res, error);
    }
  };

  // REGISTER
  createUser = async (req: Request, res: Response): Promise<Response> => {
    try {
      const user = await this.service.create(req.body ?? {});

      return res.status(201).json({
        status: 'success',
        data: user,
      });
    } catch (error) {
      return sendError(res, error);
    }
  };

  // LOGIN
  login = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.service.login(req.body ?? {});

      return res.status(200).json({
        status: 'success',
        message: 'Login berhasil',
        data: result,
      });
    } catch (error) {
      return sendError(res, error);
    }
  };

  // GET USER YANG SEDANG LOGIN
  me = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = (req as AuthRequest).user?.id;

      if (!userId) {
        return res.status(401).json({
          status: 'fail',
          message: 'Token tidak valid',
        });
      }

      const user = await this.service.getById(userId);

      return res.status(200).json({
        status: 'success',
        data: user,
      });
    } catch (error) {
      return sendError(res, error);
    }
  };
}