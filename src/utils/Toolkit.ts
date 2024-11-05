import _ from 'lodash'
import qs from 'qs'

const { chain, get, size, defaultTo } = _

export default class Toolkit {
  static buildQuery = (obj: any) => {
    const query: any = {}
    for (const key in obj) {
      if (
        obj.hasOwnProperty(key)
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
}
