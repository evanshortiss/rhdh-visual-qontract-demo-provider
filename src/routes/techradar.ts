import { Router } from "express";
import { readFile } from "node:fs/promises";
import { ApplicationConfig } from "../config";
import { TechRadarData, TechRadarLoaderResponseSchema } from "../data/types";
import { Logger } from "pino";

export default async function getTechRadarRoute (log: Logger, config: ApplicationConfig) {
  const route = Router()
  const { TECHRADAR_JSON_PATH } = config
  let techRadarData: TechRadarData

  try {
    log.info(`loading and validating homepage json data from ${TECHRADAR_JSON_PATH}`)
    const data = await readFile(TECHRADAR_JSON_PATH, 'utf-8')
    techRadarData = TechRadarLoaderResponseSchema.parse(JSON.parse(data))
  } catch (e) {
    log.fatal(`failed to read or parse ${TECHRADAR_JSON_PATH}`)
    log.fatal(e)

    process.exit(1)
  }

  route.get('/', (req, res) => res.json(techRadarData))

  return route
}
