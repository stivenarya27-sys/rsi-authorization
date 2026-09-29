import { eq } from 'drizzle-orm';
import { getDb } from '../db/index.ts';
import { reviews, users, stalls } from '../db/schema.ts';

export interface ReviewInput {
  stallId: number;
  userId: number;
  rating: number;
  comment?: string;
}

const joinedColumns = {
  id: reviews.id,
  stallId: reviews.stallId,
  stallName: stalls.name,
  userId: reviews.userId,
  userName: users.name,
  rating: reviews.rating,
  comment: reviews.comment,
  likeCount: reviews.likeCount,
  createdAt: reviews.createdAt,
  updatedAt: reviews.updatedAt,
};

export class ReviewRepository {
  async findAll() {
    const db = await getDb();

    return db
      .select(joinedColumns)
      .from(reviews)
      .innerJoin(users, eq(reviews.userId, users.id))
      .innerJoin(stalls, eq(reviews.stallId, stalls.id))
      .orderBy(reviews.id);
  }

  async create(input: ReviewInput) {
    const db = await getDb();

    const rows = await db
      .insert(reviews)
      .output()
      .values({
        stallId: input.stallId,
        userId: input.userId,
        rating: input.rating,
        comment: input.comment,
        likeCount: 0,
      });

    return rows[0];
  }

  async remove(id: number) {
    const db = await getDb();

    const rows = await db
      .delete(reviews)
      .where(eq(reviews.id, id))
      .output();

    return rows[0];
  }
}