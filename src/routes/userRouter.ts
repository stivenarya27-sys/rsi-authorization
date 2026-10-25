
import { Router } from 'express';

import { UserController } from '../controllers/userController.ts';
import { validateRequest } from '../utils/validate.ts';
import { authenticateToken } from '../utils/auth.ts';

import {
  registerSchema,
  loginSchema,
} from '../dtos/validationSchema.ts';

const userRouter = Router();
const authRouter = Router();

const userController = new UserController();

// GET /api/v1/users
// Daftar user
userRouter.get(
  '/',
  (req, res) => {
    /*
      #swagger.tags = ['Users']
      #swagger.summary = 'Daftar user'
      #swagger.parameters['role'] = {
        in: 'query',
        type: 'string'
      }
      #swagger.parameters['page'] = {
        in: 'query',
        type: 'integer'
      }
      #swagger.parameters['limit'] = {
        in: 'query',
        type: 'integer'
      }
      #swagger.responses[200] = {
        description: 'Daftar user berhasil diambil'
      }
    */

    return userController.getUsers(req, res);
  },
);

// POST /api/v1/auth/register
// Register user
authRouter.post(
  '/register',
  validateRequest(registerSchema, 'body'),
  (req, res) => {
    /*
      #swagger.tags = ['Auth']
      #swagger.summary = 'Register user'
      #swagger.consumes = ['application/json']
      #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
          $ref: '#/definitions/UserInput'
        }
      }
      #swagger.responses[201] = {
        description: 'User berhasil didaftarkan'
      }
      #swagger.responses[400] = {
        description: 'Validasi gagal'
      }
      #swagger.responses[409] = {
        description: 'Email sudah terdaftar'
      }
    */

    return userController.createUser(req, res);
  },
);

// POST /api/v1/auth/login
// Login user
authRouter.post(
  '/login',
  validateRequest(loginSchema, 'body'),
  (req, res) => {
    /*
      #swagger.tags = ['Auth']
      #swagger.summary = 'Login user'
      #swagger.consumes = ['application/json']
      #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              example: 'user@example.com'
            },
            password: {
              type: 'string',
              example: 'password123'
            }
          }
        }
      }
      #swagger.responses[200] = {
        description: 'Login berhasil, token JWT dikembalikan'
      }
      #swagger.responses[400] = {
        description: 'Validasi gagal'
      }
      #swagger.responses[401] = {
        description: 'Email atau password salah'
      }
    */

    return userController.login(req, res);
  },
);

// GET /api/v1/auth/me
// Profil user yang sedang login
authRouter.get(
  '/me',
  authenticateToken,
  (req, res) => {
    /*
      #swagger.tags = ['Auth']
      #swagger.summary = 'Profil user yang sedang login'
      #swagger.security = [{
        "BearerAuth": []
      }]
      #swagger.responses[200] = {
        description: 'Data user yang sedang login'
      }
      #swagger.responses[401] = {
        description: 'Token tidak ditemukan atau tidak valid'
      }
    */

    return userController.me(req, res);
  },
);

export { userRouter, authRouter };
