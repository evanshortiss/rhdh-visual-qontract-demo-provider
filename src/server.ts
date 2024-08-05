import type { Express } from 'express'
import express from 'express'
import homeRoute from './routes/home'
import { ApplicationConfig } from './config'
import { Logger } from 'pino'

export default async function getServer (log: Logger, config: ApplicationConfig): Promise<Express> {
  const app = express()

  app.use(require('morgan')('combined'))
  app.get('/', await homeRoute(log, config))

  return app
}
