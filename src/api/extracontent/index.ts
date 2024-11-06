import * as cheerio from 'cheerio'
import { Effect } from 'effect'
import _ from 'lodash'

import RottenTomatoeService from '../../services/RottenTomatoeService'
import Toolkit from '../../utils/Toolkit'
import type { ExtraContent } from '../../types'

const { load } = cheerio
const { defaultTo, trimStart, isEmpty } = _

function parser(html: string): ExtraContent {
  const $ = load(html)

  const synopsis = defaultTo($('rt-text[data-qa="synopsis-value"]').text().trim(), null)

  const director = defaultTo(
    $('div[data-qa="item"]')
      .filter((_, el) => $(el).find('rt-text[data-qa="item-label"]').text().includes('Director'))
      .find('rt-link[data-qa="item-value"]')
      .map((_, el) => $(el).text().trim())
      .get(),
    [],
  )

  const castAndCrew = defaultTo(
    $('a[data-qa="person-item"]')
      .map((_, el) => {
        const name = $(el).find('p[data-qa="person-name"]').text().trim()
        const role = $(el).find('p[data-qa="person-role"]').text().trim()
        const poster = $(el).find('rt-img').attr('src') || ''
        const id = $(el).attr('href') || ''
        return { name, role, poster, id }
      })
      .get(),
    [],
  )

  const seasons = $('tile-season').map((_, el) => {
    const idStr = defaultTo($(el).attr('href'), null)
    const image = defaultTo($(el).find('rt-img').attr('src'), null)
    const title = defaultTo($(el).find('rt-text[slot="title"]').text().trim(), null)

    const criticsScoreStr = $(el).find('rt-text[slot="criticsScore"]').text().trim()
    const criticsScore = isEmpty(criticsScoreStr) ? null : Number.parseInt(criticsScoreStr, 10)

    const airDateStr = $(el).find('rt-text[slot="airDate"]').text().trim()
    const airDate = isEmpty(airDateStr) ? null : Number.parseInt(airDateStr, 10)
    const finalAirDate = !airDate ? null : airDate

    const detailsLinkText = defaultTo($(el).find('rt-text[slot="details"]').text().trim(), null)

    const id = idStr ? trimStart(idStr, '/') : null

    return {
      id,
      image,
      title,
      criticsScore,
      airDate: finalAirDate,
      detailsLinkText,
    }
  }).get()

  const episodes = $('tile-episode').map((_, el) => {
    const idStr = defaultTo($(el).attr('href'), null)
    const image = defaultTo($(el).find('rt-img').attr('src'), null)
    const title = defaultTo($(el).find('rt-text[slot="title"]').text().trim(), null)

    // Parsing airDate: e.g., "Aired Oct 27, 2024"
    const airDateStr = $(el).find('rt-text[data-qa="episode-air-date"]').text().trim()
    const airDateMatch = airDateStr.match(/Aired (\w+ \d{1,2}, \d{4})/) // Extract the date (e.g., Oct 27, 2024)
    const airDate = airDateMatch ? airDateMatch[1] : null

    const episodeNumber = $(el).find('rt-text[data-qa="episode-label"]').text().trim()
    const description = defaultTo($(el).find('rt-text[slot="description"]').text().trim(), null)
    const id = idStr ? trimStart(idStr, '/') : null

    return {
      id,
      title,
      episodeNumber,
      airDate,
      description,
      image,
    }
  }).get()

  const producer = defaultTo(
    $('div[data-qa="item"]')
      .filter((_, el) => $(el).find('rt-text[data-qa="item-label"]').text().includes('Producer'))
      .find('rt-link[data-qa="item-value"]')
      .map((_, el) => $(el).text().trim())
      .get(),
    [],
  )

  const screenwriter = defaultTo(
    $('div[data-qa="item"]')
      .filter((_, el) => $(el).find('rt-text[data-qa="item-label"]').text().includes('Screenwriter'))
      .find('rt-link[data-qa="item-value"]')
      .map((_, el) => $(el).text().trim())
      .get(),
    [],
  )

  const distributor = defaultTo(
    $('div[data-qa="item"]')
      .filter((_, el) => $(el).find('rt-text[data-qa="item-label"]').text().includes('Distributor'))
      .find('rt-text[data-qa="item-value"]').text().trim(),
    null,
  )

  const productionCompanies = defaultTo(
    $('div[data-qa="item"]')
      .filter((_, el) => $(el).find('rt-text[data-qa="item-label"]').text().includes('Production Co'))
      .find('rt-text[data-qa="item-value"]')
      .map((_, el) => $(el).text().trim())
      .get(),
    [],
  )

  const network = defaultTo(
    $('div[data-qa="item"]')
      .filter((_, el) => $(el).find('rt-text[data-qa="item-label"]').text().includes('Network'))
      .find('rt-text[data-qa="item-value"]').text().trim(),
    null,
  )

  const rating = defaultTo(
    $('div[data-qa="item"]')
      .filter((_, el) => $(el).find('rt-text[data-qa="item-label"]').text().includes('Rating'))
      .find('rt-text[data-qa="item-value"]').text().trim(),
    null,
  )

  const genres = defaultTo(
    $('div[data-qa="item"]')
      .filter((_, el) => $(el).find('rt-text[data-qa="item-label"]').text().includes('Genre'))
      .find('rt-link[data-qa="item-value"]')
      .map((_, el) => $(el).text().trim())
      .get(),
    [],
  )

  const originalLanguage = defaultTo(
    $('div[data-qa="item"]')
      .filter((_, el) => $(el).find('rt-text[data-qa="item-label"]').text().includes('Original Language'))
      .find('rt-text[data-qa="item-value"]').text().trim(),
    null,
  )

  const releaseDateTheaters = defaultTo(
    $('div[data-qa="item"]')
      .filter((_, el) => $(el).find('rt-text[data-qa="item-label"]').text().includes('Release Date (Theaters)'))
      .find('rt-text[data-qa="item-value"]').text().trim(),
    null,
  )

  const releaseDateStreaming = defaultTo(
    $('div[data-qa="item"]')
      .filter((_, el) => $(el).find('rt-text[data-qa="item-label"]').text().includes('Release Date (Streaming)'))
      .find('rt-text[data-qa="item-value"]').text().trim(),
    null,
  )

  const boxOfficeGross = defaultTo(
    $('div[data-qa="item"]')
      .filter((_, el) => $(el).find('rt-text[data-qa="item-label"]').text().includes('Box Office (Gross USA)'))
      .find('rt-text[data-qa="item-value"]').text().trim(),
    null,
  )

  const runtime = defaultTo(
    $('div[data-qa="item"]')
      .filter((_, el) => $(el).find('rt-text[data-qa="item-label"]').text().includes('Runtime'))
      .find('rt-text[data-qa="item-value"]').text().trim(),
    null,
  )

  const soundMix = defaultTo(
    $('div[data-qa="item"]')
      .filter((_, el) => $(el).find('rt-text[data-qa="item-label"]').text().includes('Sound Mix'))
      .find('dd[data-qa="item-value-group"] rt-text[data-qa="item-value"]')
      .map((_, el) => $(el).text().trim())
      .get(),
    [],
  )

  const promoEndpoint = Toolkit.buildPromoEndpoint($)

  return {
    synopsis,
    castAndCrew,
    director,
    producer,
    seasons,
    episodes,
    screenwriter,
    distributor,
    productionCompanies,
    network,
    rating,
    genres,
    originalLanguage,
    releaseDateTheaters,
    releaseDateStreaming,
    boxOfficeGross,
    runtime,
    soundMix,
    promoEndpoint,
  }
}

// eslint-disable-next-line ts/explicit-function-return-type
function helper(html: string) {
  return Effect.gen(function* () {
    const result = yield * Effect.async<ExtraContent, Error>((callback) => {
      Effect.try({
        try: async () => {
          const result = parser(html)
          callback(Effect.succeed(result))
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
export default async (id: string) => {
  const htmlResponse = await RottenTomatoeService.getExtraContent(id)

  if (!htmlResponse) {
    return []
  }

  const row = await helper(htmlResponse as string)
  return row
}
