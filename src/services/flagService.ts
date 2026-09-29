import {
  FlagRepository,
  FlagUpdateInput,
} from '../repositories/flagRepository.ts';

export class FlagService {
  private repository = new FlagRepository();

  async getFlags() {
    return this.repository.findAll();
  }

  async updateFlag(id: number, input: FlagUpdateInput) {
    return this.repository.updateStatus(id, input);
  }
}