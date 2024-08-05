import { from } from 'env-var'
import { Level, levels } from 'pino'
export type ApplicationConfig = {
  HOMEPAGE_LINKS_JSON_PATH: string
}

export default function getApplicationConfig (e: NodeJS.ProcessEnv) {
  const { get } = from(e)
  
  return {
    LOG_LEVEL: get('LOG_LEVEL').default('info').asEnum<Level>(Object.values(levels.labels) as Level[]),
    HOMEPAGE_LINKS_JSON_PATH: get('HOMEPAGE_LINKS_JSON_PATH').default('./data/home.json').asString(),

    HTTP_PORT: 8080,
    HTTP_HOST: '0.0.0.0'
  }
}
