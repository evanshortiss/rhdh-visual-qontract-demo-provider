import { from } from 'env-var'
import { Level, levels } from 'pino'

export type ApplicationConfig = {
  LOG_LEVEL: string

  HTTP_PORT: number
  HTTP_HOST: string
}

export default function getApplicationConfig (e: NodeJS.ProcessEnv) {
  const { get } = from(e)
  
  return {
    LOG_LEVEL: get('LOG_LEVEL').default('info').asEnum<Level>(Object.values(levels.labels) as Level[]),

    HTTP_PORT: get('HTTP_PORT').default(8080).asPortNumber(),
    HTTP_HOST: get('HTTP_HOST').default('0.0.0.0').asString()
  }
}
