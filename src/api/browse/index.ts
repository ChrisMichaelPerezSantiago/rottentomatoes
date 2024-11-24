import type { Browse, BrowseFilter } from '../../types'
import * as cheerio from 'cheerio'
import { Effect } from 'effect'

import _ from 'lodash'
import RottenTomatoeService from '../../services/RottenTomatoeService'
import Toolkit from '../../utils/Toolkit'

const { load } = cheerio
const { defaultTo, map, parseInt, includes, trimStart } = _

function parser(element: cheerio.Element): Browse {
  const $ = cheerio.load(element)

  const title = defaultTo(
    $(element).find('span[data-qa="discovery-media-list-item-title"]').text().trim(),
    null,
  )

  const criticsScoreStr = $(element).find('rt-text[slot="criticsScore"]').text().trim()
  const audienceScoreStr = $(element).find('rt-text[slot="audienceScore"]').text().trim()
  const criticsScore = criticsScoreStr ? parseInt(criticsScoreStr.replace('%', ''), 10) : null
  const audienceScore = audienceScoreStr ? parseInt(audienceScoreStr.replace('%', ''), 10) : null

  const poster = defaultTo($(element).find('rt-img').attr('src'), null)
  const releaseDate = $(element).find('span[data-qa="discovery-media-list-item-start-date"]').text().trim()

  const href = $(element).find('a[data-track="scores"]').attr('href') || ''
  const id = href ? trimStart(href, '/') : null

  const mediaType = includes(href, '/m/') ? 'movie' : includes(href, '/tv/') ? 'tv' : null

  return {
    id,
    title,
    criticsScore,
    audienceScore,
    mediaType,
    poster,
    releaseDate,
  }
}

function helper(html: string) {
  return Effect.gen(function* () {
    const result = yield * Effect.async<Browse[], Error>((callback) => {
      Effect.try({
        try: async () => {
          const $ = load(html)
          const rows = $('div[data-qa="discovery-media-list-item"]')

          const results = map(rows, parser)
          callback(Effect.succeed(results))
        },
        catch: (error: unknown) => {
          if (error instanceof Error) {
            callback(Effect.fail(error))
          }
          else {
            callback(Effect.fail(new Error('An unknown error occurred')))
          }
        },
      }).pipe(Effect.runPromise)
    })

    return result
  }).pipe(Effect.runPromise)
}

export default async ({
  categories = 'movies_in_theaters',
  genres,
  ratings,
  audience,
  critics,
  affiliates,
  sortBy = 'sort:popular',
  pagination = { page: 1 },
  ...props

}: BrowseFilter) => {
  const query = Toolkit.buildBrowseFilter({
    categories,
    genres,
    ratings,
    audience,
    critics,
    affiliates,
    sortBy,
    pagination,
    ...props,
  })

  const htmlResponse = await RottenTomatoeService.browse(query)

  if (!htmlResponse) {
    return []
  }

  const rows = await helper(htmlResponse as string)
  return rows
}
