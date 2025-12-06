// src/routes/file.routes.ts
import { Router, Request } from 'express'
import multer, { FileFilterCallback } from 'multer'

import { uploadSheet, readSheets } from '../controllers/file.controller.js'

const router = Router()

const upload = multer({
  dest: 'tmp/',
  fileFilter: (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    try {
      const allowed = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ]

      if (allowed.includes(file.mimetype)) {
        cb(null, true)
      } else {
        cb(new Error('invalid file type'))
      }
    } catch (error: unknown) {
      const err = error instanceof Error ? error.message : 'unknown error'
      throw new Error(`[fileFilter] ${err}`)
    }
  },
})

router.post('/upload', upload.single('file'), uploadSheet)
router.get('/list', readSheets)

export default router
