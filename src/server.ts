import type { Express } from 'express'
import express from 'express'
import homeRoute from './routes/home'
import techRadar from './routes/techradar'
import { ApplicationConfig } from './config'
import { Logger } from 'pino'

export default async function getServer (log: Logger, config: ApplicationConfig): Promise<Express> {
  const app = express()

  app.use(require('morgan')('combined'))
  app.use('/home', await homeRoute(log, config))
  app.use('/techradar', await techRadar(log, config))

  return app
}
