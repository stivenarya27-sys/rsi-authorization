import { randomBytes, scryptSync } from 'node:crypto';
import { UserRepository, type Role } from '../repositories/userRepository.ts';
import { AppError } from '../utils/errors.ts';

const ROLES: Role[] = ['admin', 'owner', 'customer'];

export class UserService {
  private repo: UserRepository;

  constructor(repo: UserRepository = new UserRepository()) {
    this.repo = repo;
  }

  async getAll(params: { role?: Role; page: number; limit: number }) {
    return this.repo.findAll(params);
  }

  async create(input: { name?: string; email?: string; password?: string; role?: string }) {
    if (!input.name || !input.email || !input.password) {
      throw new AppError(400, 'name, email, dan password wajib diisi');
    }
    const role = (input.role ?? 'customer') as Role;
    if (!ROLES.includes(role)) {
      throw new AppError(400, 'role harus admin, owner, atau customer');
    }

    // Password tidak disimpan mentah: di-hash (scrypt bawaan Node, tanpa library tambahan).
    const salt = randomBytes(16).toString('hex');
    const hash = scryptSync(input.password, salt, 32).toString('hex');

    const row = await this.repo.create({
      name: input.name,
      email: input.email,
      passwordHash: `${salt}:${hash}`,
      role,
    });
    if (!row) throw new AppError(500, 'Gagal membuat user');

    const { passwordHash, ...safe } = row; // jangan kembalikan hash ke client
    return safe;
  }
}