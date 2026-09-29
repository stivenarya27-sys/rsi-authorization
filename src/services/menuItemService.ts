import { MenuItemRepository, type MenuItemInput } from '../repositories/menuItemRepository.ts';
import { AppError } from '../utils/errors.ts';

export class MenuItemService {
  private repo: MenuItemRepository;

  constructor(repo: MenuItemRepository = new MenuItemRepository()) {
    this.repo = repo;
  }

  private validate(input: Partial<MenuItemInput>, requireAll: boolean) {
    if (requireAll && (input.stallId === undefined || !input.name || input.price === undefined)) {
      throw new AppError(400, 'stallId, name, dan price wajib diisi');
    }
    if (input.price !== undefined && (!Number.isInteger(input.price) || input.price < 0)) {
      throw new AppError(400, 'price harus bilangan bulat >= 0');
    }
  }

  getAll(params: { stallId?: number; page: number; limit: number }) {
    return this.repo.findAll(params);
  }

  async getById(id: number) {
    const row = await this.repo.findById(id);
    if (!row) throw new AppError(404, 'Menu tidak ditemukan');
    return row;
  }

  async create(input: Partial<MenuItemInput>) {
    this.validate(input, true);
    const created = await this.repo.create(input as MenuItemInput);
    if (!created) throw new AppError(500, 'Gagal membuat menu');
    return this.getById(created.id); // ambil ulang dengan JOIN
  }

  async update(id: number, input: Partial<MenuItemInput>) {
    this.validate(input, false);
    const updated = await this.repo.update(id, input);
    if (!updated) throw new AppError(404, 'Menu tidak ditemukan');
    return this.getById(id);
  }

  async remove(id: number) {
    const removed = await this.repo.remove(id);
    if (!removed) throw new AppError(404, 'Menu tidak ditemukan');
    return removed;
  }
}