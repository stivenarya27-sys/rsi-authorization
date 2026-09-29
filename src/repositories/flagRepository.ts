import { eq } from 'drizzle-orm';
import { getDb } from '../db/index.ts';
import { flags } from '../db/schema.ts';

export interface FlagUpdateInput {
  status: 'pending' | 'resolved' | 'dismissed';
}

export class FlagRepository {
  async findAll() {
    const db = await getDb();

    return db
      .select()
      .from(flags)
      .orderBy(flags.id);
  }

  async updateStatus(id: number, input: FlagUpdateInput) {
    const db = await getDb();

    const rows = await db
      .update(flags)
      .set({
        status: input.status,
      })
      .where(eq(flags.id, id))
      .output();

    return rows[0];
  }
}