import type { Express } from 'express'
import express from 'express'
import { ApplicationConfig } from './config'
import { Logger } from 'pino'
import { join } from 'path'
import { readFileSync } from 'fs'

export default async function getServer (log: Logger, config: ApplicationConfig): Promise<Express> {
  const app = express()

  app.use(require('morgan')('combined'))

  app.use(express.static(join('./data')))

  const incidents = JSON.parse(readFileSync('./data/public-incidents.json', 'utf8'))
  app.get('/plugin-web-rca-backend/incidents/public', (_, res) => res.json(incidents))

  return app
}
