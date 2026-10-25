import type { Request, Response, NextFunction } from 'express';
import type { ZodType } from 'zod';

export function validateRequest(
  schema: ZodType,
  source: 'body' | 'params' | 'query' = 'body',
) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source] ?? {});

    if (!result.success) {
      return res.status(400).json({
        status: 'fail',
        message: 'Validasi gagal',
        errors: result.error.issues.map((issue) => ({
          field: issue.path.map(String).join('.') || source,
          message: issue.message,
        })),
      });
    }

    if (source === 'body') {
      req.body = result.data;
    } else {
      Object.defineProperty(req, source, {
        value: result.data,
        writable: true,
        configurable: true,
        enumerable: true,
      });
    }
    next();
  };
}