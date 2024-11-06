import RottenTomatoeService from '@/services/RottenTomatoeService'
import * as cheerio from 'cheerio'
import { Effect } from 'effect'

import _ from 'lodash'
import type { TopCritics } from '@/types'

const { load } = cheerio
const { defaultTo, map, trimStart } = _

function parser(element: cheerio.Element): TopCritics {
  const $ = cheerio.load(element)
  const reviewer = defaultTo($('a[data-qa="review-critic-link"]').text().trim(), null)
  const reviewerIdStr = defaultTo($('a[data-qa="review-critic-link"]').attr('href'), null)
  const publication = defaultTo($('a[data-qa="review-publication"]').text().trim(), null)
  const quote = defaultTo($('p.review-text').text().trim(), null)

  const originalScoreMatch = $('p.original-score-and-url').text().match(/Original Score:\s*([\d/]+)/)
  const originalScore = defaultTo(originalScoreMatch ? originalScoreMatch[1].trim() : null, null)

  const reviewDate = defaultTo($('span[data-qa="review-date"]').text().trim(), null)
  const reviewLink = defaultTo($('a.full-url').attr('href'), null)
  const criticPicture = defaultTo($('img.critic-picture').attr('src'), null)

  const reviewerId = reviewerIdStr ? trimStart(reviewerIdStr, '/') : null

  return {
    reviewerId,
    reviewer,
    criticPicture,
    publication,
    quote,
    originalScore,
    reviewDate,
    reviewLink,
  }
};

function helper(html: string) {
  return Effect.gen(function* () {
    const result = yield * Effect.async<TopCritics[], Error>((callback) => {
      Effect.try({
        try: async () => {
          const $ = load(html)
          const rows = $('div.review_table div.review-row')

          const results = map(rows, parser)
          callback(Effect.succeed(results))
        },
        catch: (error: Error) => {
          callback(Effect.fail(error))
        },
      }).pipe(Effect.runPromise)
    })

    return result
  }).pipe(Effect.runPromise)
}

export default async (id: string) => {
  const htmlResponse = await RottenTomatoeService.getTopCritics(id)

  if (!htmlResponse) {
    return []
  }

  const rows = await helper(htmlResponse as string)
  return rows
}
