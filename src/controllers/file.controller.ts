import { Request, Response } from 'express'

import { uploadFileToDrive, listFilesFromDrive } from '../services/googleDrive.service.js'

export const uploadSheet = async (req: Request, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'file is required' })

    const uploaded = await uploadFileToDrive(req.file)

    return res.status(201).json({
      message: 'file uploaded successfully',
      file: uploaded,
    })
  } catch (error: unknown) {
    const err = error instanceof Error ? error.message : 'unknown error'
    throw new Error(`[uploadSheet] ${err}`)
  }
}

export const readSheets = async (_req: Request, res: Response) => {
  try {
    const files = await listFilesFromDrive()

    return res.status(200).json(files)
  } catch (error: unknown) {
    const err = error instanceof Error ? error.message : 'unknown error'
    throw new Error(`[readSheets] ${err}`)
  }
}
