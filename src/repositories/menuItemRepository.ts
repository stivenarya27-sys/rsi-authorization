import { count, eq } from 'drizzle-orm';
import { getDb } from '../db/index.ts';
import { menuItems, stalls } from '../db/schema.ts';

export interface MenuItemInput {
  stallId: number;
  name: string;
  price: number;
  isAvailable?: boolean;
}

// Kolom hasil JOIN dengan STALLS
const joinedColumns = {
  id: menuItems.id,
  stallId: menuItems.stallId,
  name: menuItems.name,
  price: menuItems.price,
  isAvailable: menuItems.isAvailable,
  stallName: stalls.name,
  stallLocation: stalls.location,
};

export class MenuItemRepository {
  async findByStallId(stallId: number) {
    const db = await getDb();
    return db.select().from(menuItems).where(eq(menuItems.stallId, stallId));
  }

  async findAll(params: { stallId?: number; page: number; limit: number }) {
    const db = await getDb();
    const where = params.stallId ? eq(menuItems.stallId, params.stallId) : undefined;

    const rows = await db
      .select(joinedColumns)
      .from(menuItems)
      .innerJoin(stalls, eq(menuItems.stallId, stalls.id))
      .where(where)
      .orderBy(menuItems.id)
      .offset((params.page - 1) * params.limit)
      .fetch(params.limit);

    const totals = await db.select({ total: count() }).from(menuItems).where(where);
    return { rows, total: Number(totals[0]?.total ?? 0) };
  }

  async findById(id: number) {
    const db = await getDb();
    const rows = await db
      .select(joinedColumns)
      .from(menuItems)
      .innerJoin(stalls, eq(menuItems.stallId, stalls.id))
      .where(eq(menuItems.id, id));
    return rows[0];
  }

  async create(input: MenuItemInput) {
    const db = await getDb();
    const rows = await db
      .insert(menuItems)
      .output()
      .values({
        stallId: input.stallId,
        name: input.name,
        price: input.price,
        isAvailable: input.isAvailable ?? true,
      });
    return rows[0];
  }

  async update(id: number, input: Partial<MenuItemInput>) {
    const db = await getDb();
    const rows = await db
      .update(menuItems)
      .set({
        ...(input.stallId !== undefined ? { stallId: input.stallId } : {}),
        ...(input.name !== undefined ? { name: input.name } : {}),
        ...(input.price !== undefined ? { price: input.price } : {}),
        ...(input.isAvailable !== undefined ? { isAvailable: input.isAvailable } : {}),
      })
      .where(eq(menuItems.id, id))
      .output();
    return rows[0];
  }

  async remove(id: number) {
    const db = await getDb();
    const rows = await db.delete(menuItems).where(eq(menuItems.id, id)).output();
    return rows[0];
  }
}