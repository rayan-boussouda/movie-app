import { Multer } from 'multer'

declare global {
  namespace Express {
    interface Request {
      user?: { userId: number; role: string }
      file?: Multer.File
    }
  }
}
