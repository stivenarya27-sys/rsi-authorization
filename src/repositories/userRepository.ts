import { count, eq } from 'drizzle-orm';
import { getDb } from '../db/index.ts';
import { users } from '../db/schema.ts';

export type Role = 'admin' | 'owner' | 'customer';

export class UserRepository {
  async findAll(params: { role?: Role; page: number; limit: number }) {
    const db = await getDb();
    const where = params.role ? eq(users.role, params.role) : undefined;

    // Password hash tidak dikembalikan
    const rows = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(where)
      .orderBy(users.id)
      .offset((params.page - 1) * params.limit)
      .fetch(params.limit);

    const totals = await db.select({ total: count() }).from(users).where(where);

    return {
      rows,
      total: Number(totals[0]?.total ?? 0),
    };
  }

  async create(input: {
    name: string;
    email: string;
    passwordHash: string;
    role: Role;
  }) {
    const db = await getDb();
    const rows = await db.insert(users).output().values(input);

    return rows[0];
  }

  async findByEmail(email: string) {
    const db = await getDb();

    const rows = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    return rows[0];
  }

  // Mengambil user berdasarkan ID
  async findById(id: number) {
    const db = await getDb();

    const rows = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, id));

    return rows[0];
  }
}