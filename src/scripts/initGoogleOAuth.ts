import fs from 'fs'
import path from 'path'
import readline from 'readline'

import { google } from 'googleapis'

const CREDENTIALS_PATH = path.resolve('src/config/credentials.json')
const TOKEN_PATH = path.resolve('src/config/token.json')
const SCOPES = ['https://www.googleapis.com/auth/drive.file']

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

const createOAuthClient = () => {
  try {
    const credentialsRaw = fs.readFileSync(CREDENTIALS_PATH, 'utf-8')
    const credentials = JSON.parse(credentialsRaw) as OAuthCredentials
    const info = credentials.installed ?? credentials.web

    if (!info) {
      throw new Error('invalid OAuth2 credentials file')
    }

    const { client_id, client_secret, redirect_uris } = info

    return new google.auth.OAuth2(client_id, client_secret, redirect_uris[0])
  } catch (error: unknown) {
    const err = error instanceof Error ? error.message : 'unknown error'
    throw new Error(`[createOAuthClient] ${err}`)
  }
}

const requestNewToken = (oAuth2Client: InstanceType<typeof google.auth.OAuth2>) => {
  try {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    })

    console.log('Authorize this app by visiting this url:')
    console.log(authUrl)

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })

    rl.question('Enter the code from that page: ', (code) => {
      rl.close()

      oAuth2Client.getToken(code, (error, token) => {
        try {
          if (error || !token) {
            throw new Error('failed to retrieve access token')
          }

          fs.writeFileSync(TOKEN_PATH, JSON.stringify(token, null, 2), {
            encoding: 'utf-8',
          })

          console.log('Token stored at:', TOKEN_PATH)
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : 'unknown error'
          throw new Error(`[getTokenCallback] ${msg}`)
        }
      })
    })
  } catch (error: unknown) {
    const err = error instanceof Error ? error.message : 'unknown error'
    throw new Error(`[requestNewToken] ${err}`)
  }
}

const main = () => {
  try {
    const oAuth2Client = createOAuthClient()
    requestNewToken(oAuth2Client)
  } catch (error: unknown) {
    const err = error instanceof Error ? error.message : 'unknown error'
    throw new Error(`[initGoogleOAuthMain] ${err}`)
  }
}

main()
