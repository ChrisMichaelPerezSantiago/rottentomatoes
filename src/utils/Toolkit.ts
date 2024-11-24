import type { BrowseFilter } from '../types'
import _ from 'lodash'

import qs from 'qs'

const { chain, get, size, defaultTo, compact, join, isEmpty } = _

export default class Toolkit {
  static buildQuery = (obj: any) => {
    const query: any = {}
    for (const key in obj) {
      if (
        Object.prototype.hasOwnProperty.call(obj, key)
        && obj[key] !== undefined
        && obj[key] !== null
        && obj[key] !== ''
      ) {
        query[key] = obj[key]
      }
    }
    return qs.stringify(query, { encodeValuesOnly: true })
  }

  static buildId = (href: string): string =>
    chain(href).split('/').compact().slice(2).join('/').value()

  static buildPromoEndpoint = ($: cheerio.Root): string | null => {
    const button = $('rt-button[slot="iconicVideoCta"]')

    if (size(button) === 0) {
      return null
    }

    const firstButton = button[0]
    const attribs = defaultTo(get(firstButton, 'attribs'), null)

    if (!attribs) {
      return null
    }

    const emsId = defaultTo(get(attribs, 'data-ems-id'), null)
    const publicId = defaultTo(get(attribs, 'data-public-id'), null)
    const type = defaultTo(get(attribs, 'data-type'), null)

    if (!emsId || !publicId || !type) {
      return null
    }

    return `https://www.rottentomatoes.com/napi/videos?emsId=${emsId}&publicId=${publicId}&type=${type}`
  }

  static buildBrowseFilter = ({ categories, genres, ratings, audience, critics, affiliates, sortBy, pagination }: BrowseFilter): string => {
    const categorySegment = defaultTo(`${categories}`, null)
    const genresSegment = genres ? defaultTo(`genres:${join(genres, ',')}`, null) : null
    const ratingsSegment = ratings ? defaultTo(`ratings:${join(ratings, ',')}`, null) : null
    const audienceSegment = audience ? defaultTo(`audience:${join(audience, ',')}`, null) : null
    const criticsSegment = critics ? defaultTo(`critics:${join(critics, ',')}`, null) : null
    const affiliatesSegment = affiliates ? defaultTo(`affiliates:${join(affiliates, ',')}`, null) : null
    const sortSegment = sortBy

    const segments = [
      genresSegment,
      ratingsSegment,
      audienceSegment,
      criticsSegment,
      affiliatesSegment,
      sortSegment,
    ]

    let query = null

    const containDefaultFilters = categories && sortBy && !(isEmpty(genres) || isEmpty(ratings) || isEmpty(audience) || isEmpty(critics) || isEmpty(affiliates))

    if (containDefaultFilters) {
      query = compact([categorySegment, sortSegment]).join('/')
    }
    else {
      query = `${categorySegment}/${compact(segments).join('~')}`
    }

    return `${query}?${Toolkit.buildQuery({ page: pagination.page })}`
  }
}
