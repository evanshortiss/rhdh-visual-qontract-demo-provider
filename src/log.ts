import pino from "pino"

export default function getLogger (level: pino.Level) {
  return pino({ level })
}
