import getServer from './server'
import getApplicationConfig from './config'
import getLogger from './log'

const config = getApplicationConfig(process.env)
const log = getLogger(config.LOG_LEVEL)

async function main () {
  const { HTTP_HOST, HTTP_PORT } = config
  const signals = ['SIGINT', 'SIGTERM']
  
  log.info('starting rhdh customisations server')
  
  signals.forEach((s) => {
    process.on(s, () => {
      log.warn(`process received ${s}. terminating process`)
      process.exit(0)
    })
  })


  const server = await getServer(log, config)

  server.listen(HTTP_PORT, HTTP_HOST, () => {
    log.info(`server is listening on http://${HTTP_HOST}:${HTTP_PORT}`)
  })
}

main()
