import type { Express } from 'express'
import express from 'express'
import { ApplicationConfig } from './config'
import { Logger } from 'pino'
import { join } from 'path'
import { readFileSync, writeFileSync } from 'fs'

type Story = {
  title: string
  id: string,
  date: string,
  image: "/resources/images/rhd-logo.png"|"/resources/images/rht-logo.png",
  featured: true
  link: {
    text: "Read More",
    url: string
  },
  body: string
}

type Newsfeed = [
  {
    title: string,
    id: string,
    stories: Story[]
  }
]

export default async function getServer (log: Logger, config: ApplicationConfig): Promise<Express> {
  const app = express()
  const Parser = require('rss-parser');
  const parser = new Parser();

  app.use(require('morgan')('combined'))

  app.use(express.static(join('./data')))

  const status = JSON.parse(readFileSync('./data/status.json', 'utf8'))
  app.get('/status', (_, res) => res.json(status))

  const incidents = JSON.parse(readFileSync('./data/public-incidents.json', 'utf8'))
  app.get('/plugin-web-rca-backend/incidents/public', (_, res) => res.json(incidents))

  app.get('/resources/json/hotnews.json', async (_, res, next) => {

    function processDevelopersFeed (feed: any): Story[] {
      return feed.map((e: any) => {
        return {
          title: e.title,
          id: e.guid,
          date: e.isoDate,
          image: "/resources/images/rhd-logo.png",
          featured: true,
          link: {
            text: "Read More",
            url: e.link
          },
          body: e.contentSnippet
        }
      })
    }

    function processCloudFeed (feed: any): Story[] {
      return feed.map((e: any) => {
        return {
          title: e.title,
          id: e.guid,
          date: e.isoDate,
          image: "/resources/images/rht-logo.png",
          featured: true,
          link: {
            text: "Read More",
            url: e.link
          },
          body: e.contentSnippet
        }
      })
    }

    try {
      const [developers, cloud] = await Promise.all([
        parser.parseURL('https://developers.redhat.com/blog/feed/atom'),
        parser.parseURL('https://www.redhat.com/en/rss/blog')
      ])

      const newsfeed: Newsfeed = [{
        title: 'News',
        id: 'news',
        stories: processCloudFeed(cloud.items).concat(processDevelopersFeed(developers.items))
          .sort((a, b) => {
            const d1 = new Date(a.date).getTime()
            const d2 = new Date(b.date).getTime()

            if (d1 === d2) {
              return 0
            }

            return d1 > d2 ? -1 : 1
          })
      }]

      res.json(newsfeed)
    } catch (e) {
      next(e)
    }
  })

  return app
}
