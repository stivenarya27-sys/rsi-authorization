import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { Role } from '../repositories/userRepository.ts';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    role: Role;
  };
}

// Middleware untuk memeriksa token JWT
export function authenticateToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({
      status: 'fail',
      message: 'Token tidak ditemukan',
    });
  }

  // Ambil token saja, buang koma/spasi sisa jika header terkirim ganda
  const token = authorization.slice(7).split(',')[0]?.trim();
  const secret = process.env.JWT_SECRET;

  if (!token || !secret) {
    return res.status(401).json({
      status: 'fail',
      message: 'Token tidak valid',
    });
  }

  try {
    const decoded = jwt.verify(token, secret);

    if (
      typeof decoded === 'string' ||
      typeof decoded.id !== 'number' ||
      !['admin', 'owner', 'customer'].includes(decoded.role as string)
    ) {
      return res.status(401).json({
        status: 'fail',
        message: 'Token tidak valid',
      });
    }

    req.user = {
      id: decoded.id,
      role: decoded.role as Role,
    };

    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'fail',
        message: 'Token sudah kedaluwarsa',
      });
    }
    return res.status(401).json({
      status: 'fail',
      message: 'Token tidak valid',
    });
  }
}

// Middleware untuk memeriksa role pengguna
export function authorizeRole(...allowedRoles: Role[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'fail',
        message: 'Anda belum login',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'fail',
        message: 'Anda tidak memiliki izin untuk mengakses resource ini',
      });
    }

    next();
  };
}