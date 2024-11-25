import { Router } from "express";
import { readFile } from "node:fs/promises";
import { ApplicationConfig } from "../config";
import { HomePageDataArray } from "../data/types";
import { Logger } from "pino";

export default async function getHomeRoute (log: Logger, config: ApplicationConfig) {
  const route = Router()
  const { HOMEPAGE_LINKS_JSON_PATH } = config
  let homeData: HomePageDataArray

  try {
    log.info(`loading and validating homepage json data from ${HOMEPAGE_LINKS_JSON_PATH}`)
    const data = await readFile(HOMEPAGE_LINKS_JSON_PATH, 'utf-8')
    homeData = HomePageDataArray.parse(JSON.parse(data))
  } catch (e) {
    log.fatal('failed to read or parse homepage json')
    log.fatal(e)

    process.exit(1)
  }

  route.get('/', (req, res) => {
    console.log('x')
    res.json(homeData)
  })

  return route
}
