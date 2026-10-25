import {
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from 'node:crypto';

import jwt from 'jsonwebtoken';

import {
  UserRepository,
  type Role,
} from '../repositories/userRepository.ts';

import { AppError } from '../utils/errors.ts';

export class UserService {
  private repo: UserRepository;

  constructor(repo: UserRepository = new UserRepository()) {
    this.repo = repo;
  }

  async getAll(params: {
    role?: Role;
    page: number;
    limit: number;
  }) {
    return this.repo.findAll(params);
  }

  // REGISTER
  async create(input: {
    name?: string;
    email?: string;
    password?: string;
    role?: string;
  }) {
    if (!input.name || !input.email || !input.password) {
      throw new AppError(
        400,
        'name, email, dan password wajib diisi',
      );
    }

    // Register publik hanya membuat customer
    const role: Role = 'customer';

    const name = input.name.trim();
    const email = input.email.trim().toLowerCase();

    const salt = randomBytes(16).toString('hex');

    const hash = scryptSync(
      input.password,
      salt,
      32,
    ).toString('hex');

    const row = await this.repo.create({
      name,
      email,
      passwordHash: `${salt}:${hash}`,
      role,
    });

    if (!row) {
      throw new AppError(500, 'Gagal membuat user');
    }

    const { passwordHash, ...safeUser } = row;

    return safeUser;
  }

  // LOGIN
  async login(input: {
    email?: string;
    password?: string;
  }) {
    if (!input.email || !input.password) {
      throw new AppError(
        400,
        'Email dan password wajib diisi',
      );
    }

    const email = input.email.trim().toLowerCase();
    const user = await this.repo.findByEmail(email);

    if (!user) {
      throw new AppError(401, 'Email atau password salah');
    }

    // Password tersimpan dengan format salt:hash
    const [salt, storedHash] = user.passwordHash.split(':');

    if (!salt || !storedHash) {
      throw new AppError(401, 'Email atau password salah');
    }

    const hashedPassword = scryptSync(
      input.password,
      salt,
      32,
    );

    const originalHash = Buffer.from(storedHash, 'hex');

    if (
      originalHash.length !== hashedPassword.length ||
      !timingSafeEqual(originalHash, hashedPassword)
    ) {
      throw new AppError(401, 'Email atau password salah');
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new AppError(500, 'JWT_SECRET belum dikonfigurasi');
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      secret,
      {
        expiresIn: '1h',
      },
    );

    const { passwordHash, ...safeUser } = user;

    return {
      user: safeUser,
      token,
    };
  }

  // GET USER BERDASARKAN ID
  async getById(id: number) {
    const user = await this.repo.findById(id);

    if (!user) {
      throw new AppError(404, 'User tidak ditemukan');
    }

    return user;
  }
}