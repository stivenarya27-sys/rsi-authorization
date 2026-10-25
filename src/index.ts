
import express, {
  type Request,
  type Response,
  type NextFunction,
  type Application,
} from 'express';

import { sql } from 'drizzle-orm';
import swaggerUi from 'swagger-ui-express';

import swaggerDocument from './docs/swagger-output.json' with { type: 'json' };

import { getDb } from './db/index.ts';

import { stallRouter } from './routes/stallRouter.ts';
import { authRouter } from './routes/userRouter.ts';
import { menuItemRouter } from './routes/menuItemRouter.ts';
import { reviewRouter } from './routes/reviewRouter.ts';
import { likeRouter } from './routes/likeRouter.ts';
import { flagRouter } from './routes/flagRouter.ts';
import { auditRouter } from './routes/auditRouter.ts';

const app: Application = express();
const PORT = 3000;

app.use(express.json());

// Swagger
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Health Check
app.get('/health', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    await db.execute(sql`SELECT 1 AS ok`);

    res.status(200).json({
      status: 'success',
      message: 'Server dan database terhubung',
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Gagal terhubung ke database',
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

// Routes
app.use('/api/v1/stalls', stallRouter);

// Autentikasi
app.use('/api/v1/auth', authRouter);

app.use('/api/v1/menu-items', menuItemRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/likes', likeRouter);
app.use('/api/v1/flags', flagRouter);
app.use('/api/v1/audit', auditRouter);

// Rute tidak dikenal -> JSON
app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: 'fail',
    message: 'Endpoint tidak ditemukan',
  });
});

// Handler error global -> JSON
app.use(
  (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err?.type === 'entity.parse.failed') {
      return res.status(400).json({
        status: 'fail',
        message: 'Format JSON tidak valid',
      });
    }

    console.error(err);

    return res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan pada server',
    });
  },
);

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
