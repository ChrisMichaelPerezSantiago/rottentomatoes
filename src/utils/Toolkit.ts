import _ from 'lodash'
import qs from 'qs'

import type { BrowseFilter } from '../types'

const { chain, get, size, defaultTo, compact, join, isEmpty } = _

export default class Toolkit {
  // eslint-disable-next-line ts/explicit-function-return-type
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
    const sortSegment = sortBy

    const generateSegment = (key: string, values: string[] | null): string | null =>
      values && !isEmpty(values) ? `${key}:${join(values, ',')}` : null

    const filterSegments = {
      genres,
      ratings,
      audience,
      critics,
      affiliates,
    }

    const optionalFilterSegments = Object.keys(filterSegments).reduce((acc, key) => {
      const segment = generateSegment(key, filterSegments[key])
      if (segment)
        acc.push(segment)
      return acc
    }, [] as string[])

    let query = null

    const containDefaultFilters = categories && sortBy && !(isEmpty(genres) || isEmpty(ratings) || isEmpty(audience) || isEmpty(critics) || isEmpty(affiliates))

    if (containDefaultFilters) {
      query = compact([categorySegment, sortSegment]).join('/')
    }
    else {
      query = `${categorySegment}/${compact(optionalFilterSegments.concat(sortSegment)).join('~')}`
    }

    return `${query}?${Toolkit.buildQuery({ page: pagination.page })}`
  }
}
