import { Context, Effect, Layer } from 'effect'

import type { HttpClientConfig, ResponseType } from '../types'

function makeHttpClientService(config: HttpClientConfig) {
  return Effect.gen(function* () {
    const makeRequest = <T>(endpoint: string, responseType: ResponseType = 'json', options?: RequestInit) =>
      Effect.try({
        try: async () => {
          const url = `${config.baseUrl}${endpoint}`

          const headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
            'Accept-Language': 'en-US',
            'Accept-Encoding': 'gzip, deflate',
            'Accept': 'text/html',
            'Referer': 'https://www.google.com',
            ...options?.headers,
          }

          const response = await fetch(url, {
            ...options,
            headers,
          })

          if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`)
          }

          const responseHandlers: Record<typeof responseType, () => Promise<T>> = {
            json: () => response.json() as Promise<T>,
            text: () => response.text() as Promise<T>,
            blob: () => response.blob() as Promise<T>,
            arrayBuffer: () => response.arrayBuffer() as Promise<T>,
          }

          return responseHandlers[responseType]()
        },
        catch: (error: unknown) => {
          if (error instanceof Error) {
            console.error(`[makeRequest]: Error response:`, error)
            throw error
          }
          else {
            throw new TypeError('[makeRequest]: An unknown error occurred')
          }
        },
      })

    return { makeRequest } as const
  })
}

export default class HttpClientService extends Context.Tag('HttpClientService')<
  HttpClientService,
  Effect.Effect.Success<ReturnType<typeof makeHttpClientService>>
>() {
  static Live = (config: HttpClientConfig) =>
    Layer.effect(HttpClientService, makeHttpClientService(config))
}
