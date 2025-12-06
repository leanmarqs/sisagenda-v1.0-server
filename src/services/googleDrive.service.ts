// src/services/googleDrive.service.ts
import fs from 'fs'

import drive from '../config/googleClient.js'

const FOLDER_ID = process.env.GOOGLE_DRIVE_REPORTS_FOLDER_ID as string

export const uploadFileToDrive = async (file: Express.Multer.File) => {
  try {
    const fileMetadata = {
      name: file.originalname,
      parents: [FOLDER_ID],
    }

    const media = {
      mimeType: file.mimetype,
      body: fs.createReadStream(file.path),
    }

    const { data } = await drive.files.create({
      requestBody: fileMetadata,
      media,
      fields: 'id, name',
    })

    fs.unlinkSync(file.path)

    return data
  } catch (error: unknown) {
    const err = error instanceof Error ? error.message : 'unknown error'
    throw new Error(`[uploadFileToDrive] ${err}`)
  }
}

export const listFilesFromDrive = async () => {
  try {
    const { data } = await drive.files.list({
      q: `'${FOLDER_ID}' in parents`,
      fields: 'files(id, name, mimeType)',
    })

    return data.files || []
  } catch (error: unknown) {
    const err = error instanceof Error ? error.message : 'unknown error'
    throw new Error(`[listFilesFromDrive] ${err}`)
  }
}
