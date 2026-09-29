import {
  LikeRepository,
  LikeInput,
} from '../repositories/likeRepository.ts';

export class LikeService {
  private repository = new LikeRepository();

  async createLike(input: LikeInput) {
    return this.repository.create(input);
  }

  async deleteLike(id: number) {
    return this.repository.remove(id);
  }
}