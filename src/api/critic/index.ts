import * as cheerio from 'cheerio'
import { Effect } from 'effect'
import _ from 'lodash'

import RottenTomatoeService from '../../services/RottenTomatoeService'
import type { Critic, CriticBio, CriticMediaType, CriticReview } from '../../types'

const { load } = cheerio
const { defaultTo, map, isNaN } = _

function tableParser(element: cheerio.Element): CriticReview {
  const $ = cheerio.load(element)
  const rating = defaultTo($('td[data-qa="critic-review-rating"] span').text().trim() || null, null)
  const tomatometerScoreStr = defaultTo($('td[data-qa="critic-review-tomatometer"] .critics-score').text().trim(), null)
  const title = defaultTo($('td[data-qa="critic-review-title"] a').text().trim(), null)
  const yearStr = defaultTo($('td[data-qa="critic-review-title"] span').text().replace(/[()]/g, '').trim(), null)
  const reviewSnippet = defaultTo($('td[data-qa="critic-review"] span').text().trim(), null)
  const publication = defaultTo($('td[data-qa="critic-review"] .publication-link span').text().trim(), null)
  const reviewLink = defaultTo($('td[data-qa="critic-review"] div a').attr('href'), null)
  const reviewDate = defaultTo($('td[data-qa="critic-review"] div span').text().trim(), null)

  const year = yearStr && !isNaN(Number.parseInt(yearStr, 10)) ? Number.parseInt(yearStr, 10) : null
  const tomatometerScore = tomatometerScoreStr ? Number.parseInt(tomatometerScoreStr, 10) : null

  return {
    title,
    year,
    rating,
    tomatometerScore,
    reviewSnippet,
    publication,
    reviewLink,
    reviewDate,
  }
}

function bioParser(html: string): CriticBio {
  const $ = load(html)

  const bioSummary = $('section.critic-person__bio')
  const name = defaultTo(bioSummary.find('h1[data-qa="critic-name-title"]').text().trim(), null)
  const image = defaultTo(bioSummary.find('img').attr('src'), null)
  const approvalStatus = defaultTo(bioSummary.find('.critic-person__bio__summary > div > div').text().trim(), null)
  const publications = bioSummary.find('div[data-qa="section:critic-profile-publications"] .publication-link')
  const publicationList = publications.length
    ? map(publications, link => defaultTo($(link).text().trim(), null))
    : []
  const criticsGroup = bioSummary.find('div[data-qa="section:critic-profile-group"] .publication-link')
  const criticsGroupName = criticsGroup.length
    ? defaultTo(criticsGroup.first().text().trim(), null)
    : null

  return { name, image, approvalStatus, publications: publicationList, criticsGroup: criticsGroupName }
}

// eslint-disable-next-line ts/explicit-function-return-type
function helper(html: string) {
  return Effect.gen(function* () {
    const result = yield * Effect.async<Critic, Error>((callback) => {
      Effect.try({
        try: async () => {
          const $ = load(html)
          const rows = $('div.sort-table tbody tr[data-qa="row"]')

          const reviews = map(rows, tableParser)
          const bio = bioParser(html)

          callback(Effect.succeed({ bio, reviews }))
        },
        catch: (error: Error) => {
          callback(Effect.fail(error))
        },
      }).pipe(Effect.runPromise)
    })

    return result
  }).pipe(Effect.runPromise)
}

// eslint-disable-next-line ts/explicit-function-return-type
export default async (id: string, criticMediaType: CriticMediaType) => {
  const htmlResponse = await RottenTomatoeService.getCritic(id, criticMediaType)

  if (!htmlResponse) {
    return { reviews: [], bio: null }
  }

  const result = await helper(htmlResponse as string)
  return result
}
