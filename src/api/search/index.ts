import type { SearchResult } from '../../types'
import * as cheerio from 'cheerio'
import { Effect } from 'effect'

import _ from 'lodash'
import RottenTomatoeService from '../../services/RottenTomatoeService'
import Toolkit from '../../utils/Toolkit'

const { load } = cheerio
const { defaultTo, map, split, parseInt, includes } = _

function parser(element: cheerio.Element): SearchResult {
  const $ = cheerio.load(element)
  const castStr = defaultTo($(element).attr('cast'), null)
  const yearStr = defaultTo($(element).attr('releaseyear'), null)
  const scoreStr = defaultTo($(element).attr('tomatometerscore'), null)
  const title = defaultTo(
    $(element).find('a[data-qa="info-name"]').text().trim(),
    null,
  )
  const poster = defaultTo($(element).find('img').attr('src'), null)
  const year = yearStr ? parseInt(yearStr, 10) : null
  const score = scoreStr ? parseInt(scoreStr, 10) : null

  const href = $(element).find('a[class="unset"]').attr('href') || ''
  const id = Toolkit.buildId(href)

  const cast = castStr ? split(castStr, ',') : []
  const mediaType = includes(href, '/m/') ? 'movie' : includes(href, '/tv/') ? 'tv' : null

  return {
    id,
    title,
    cast,
    year,
    score,
    mediaType,
    poster,
  }
};

function helper(html: string) {
  return Effect.gen(function* () {
    const result = yield * Effect.async<SearchResult[], Error>((callback) => {
      Effect.try({
        try: async () => {
          const $ = load(html)
          const rows = $('ul[slot="list"] search-page-media-row')

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

export default async (query: string) => {
  const htmlResponse = await RottenTomatoeService.search({
    search: query,
  })

  if (!htmlResponse) {
    return []
  }

  const rows = await helper(htmlResponse as string)
  return rows
}
