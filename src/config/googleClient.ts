// src/config/googleClient.ts
import fs from 'fs'
import path from 'path'

import { google, drive_v3 } from 'googleapis'

const CREDENTIALS_PATH = path.resolve('src/config/credentials.json')
const TOKEN_PATH = path.resolve('src/config/token.json')

type OAuthCredentials = {
  installed?: {
    client_id: string
    client_secret: string
    redirect_uris: string[]
  }
  web?: {
    client_id: string
    client_secret: string
    redirect_uris: string[]
  }
}

const createDriveClient = (): drive_v3.Drive => {
  try {
    const credentialsRaw = fs.readFileSync(CREDENTIALS_PATH, 'utf-8')
    const credentials = JSON.parse(credentialsRaw) as OAuthCredentials
    const info = credentials.installed ?? credentials.web

    if (!info) {
      throw new Error('invalid OAuth2 credentials file')
    }

    const { client_id, client_secret, redirect_uris } = info

    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0])

    const tokenRaw = fs.readFileSync(TOKEN_PATH, 'utf-8')
    const token = JSON.parse(tokenRaw)

    oAuth2Client.setCredentials(token)

    return google.drive({ version: 'v3', auth: oAuth2Client })
  } catch (error: unknown) {
    const err = error instanceof Error ? error.message : 'unknown error'
    throw new Error(`[createDriveClient] ${err}`)
  }
}

let drive: drive_v3.Drive

try {
  drive = createDriveClient()
} catch (error: unknown) {
  const err = error instanceof Error ? error.message : 'unknown error'
  throw new Error(`[googleClient] ${err}`)
}

export default drive
