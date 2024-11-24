import type { CriticMediaType, SearchURLParams } from '../types'

import { Effect } from 'effect'
import Toolkit from '../utils/Toolkit'
import HttpClientService from './HttpClientService'

const { buildQuery } = Toolkit

const endpoint = 'https://www.rottentomatoes.com/'

export default {
  search: (params: SearchURLParams) => {
    const queryString = `search?${buildQuery(params)}`

    return Effect.gen(function* () {
      const httpClientService = yield * HttpClientService
      return yield * httpClientService.makeRequest(queryString, 'text')
    }).pipe(
      Effect.provide(
        HttpClientService.Live({
          baseUrl: endpoint,
        }),
      ),
      Effect.runPromise,
    )
  },
  getExtraContent: (id: string) => {
    return Effect.gen(function* () {
      const queryString = `/${id}`

      const httpClientService = yield * HttpClientService
      return yield * httpClientService.makeRequest(queryString, 'text')
    }).pipe(
      Effect.provide(
        HttpClientService.Live({
          baseUrl: endpoint,
        }),
      ),
      Effect.runPromise,
    )
  },

  getTopCritics: (id: string) => {
    return Effect.gen(function* () {
      const queryString = `${id}/reviews?${buildQuery({ type: 'top_critics' })}`

      const httpClientService = yield * HttpClientService
      return yield * httpClientService.makeRequest(queryString, 'text')
    }).pipe(
      Effect.provide(
        HttpClientService.Live({
          baseUrl: endpoint,
        }),
      ),
      Effect.runPromise,
    )
  },

  getCritic: (id: string, criticMediaType: CriticMediaType) => {
    return Effect.gen(function* () {
      const queryString = `${id}/${criticMediaType}`

      const httpClientService = yield * HttpClientService
      return yield * httpClientService.makeRequest(queryString, 'text')
    }).pipe(
      Effect.provide(
        HttpClientService.Live({
          baseUrl: endpoint,
        }),
      ),
      Effect.runPromise,
    )
  },

  browse: (filters: string) => {
    return Effect.gen(function* () {
      const queryString = `browse/${filters}`

      const httpClientService = yield * HttpClientService
      return yield * httpClientService.makeRequest(queryString, 'text')
    }).pipe(
      Effect.provide(
        HttpClientService.Live({
          baseUrl: endpoint,
        }),
      ),
      Effect.runPromise,
    )
  },
}
