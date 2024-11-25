import { from } from 'env-var'
import { Level, levels } from 'pino'
export type ApplicationConfig = {
  HOMEPAGE_LINKS_JSON_PATH: string
  TECHRADAR_JSON_PATH: string
}

export default function getApplicationConfig (e: NodeJS.ProcessEnv) {
  const { get } = from(e)
  
  return {
    LOG_LEVEL: get('LOG_LEVEL').default('info').asEnum<Level>(Object.values(levels.labels) as Level[]),
    HOMEPAGE_LINKS_JSON_PATH: get('HOMEPAGE_LINKS_JSON_PATH').default('./data/home.json').asString(),
    TECHRADAR_JSON_PATH: get('TECHRADAR_JSON_PATH').default('./data/techradar.json').asString(),

    HTTP_PORT: get('HTTP_PORT').default(8080).asPortNumber(),
    HTTP_HOST: get('HTTP_HOST').default('0.0.0.0').asString()
  }
}
