import type { Response } from 'express';

export class AppError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function errorText(error: unknown): string {
  const parts: string[] = [];
  let current: unknown = error;
  for (let i = 0; i < 5 && current instanceof Error; i++) {
    parts.push(current.message);
    current = current.cause;
  }
  return parts.join(' | ');
}

export function sendError(res: Response, error: unknown): Response {
  if (error instanceof AppError) {
    return res.status(error.status).json({
      status: error.status >= 500 ? 'error' : 'fail',
      message: error.message,
    });
  }
  const text = errorText(error);
  if (/UNIQUE KEY|duplicate key/i.test(text)) {
    return res.status(409).json({ status: 'fail', message: 'Data sudah ada (duplikat)' });
  }
  if (/FOREIGN KEY/i.test(text)) {
    return res.status(400).json({ status: 'fail', message: 'Data terkait tidak valid atau masih dipakai' });
  }
  return res.status(500).json({
    status: 'error',
    message: 'Terjadi kesalahan pada server',
    error: error instanceof Error ? error.message : String(error),
  });
}