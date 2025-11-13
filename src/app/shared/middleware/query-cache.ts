import { UseCase } from '../types/traits'

/**
 * Options for the query cache middleware.
 */
export type QueryCacheOptions = {
  timeout?: number
}

type CacheEntry<T> = {
  result: T
  timeout: number
}

/**
 * Middleware that adds caching capabilities to a use case based on its query parameters.
 * If the same query is executed multiple times, the cached result is returned unless the cache has expired.
 */
export default function makeQueryCacheMiddleware() {
  return function withQueryCache<TQuery, TResult>(
    useCase: UseCase<[TQuery], TResult>,
    options?: QueryCacheOptions
  ) {
    const cache: Map<string, CacheEntry<TResult>> = new Map()

    return {
      async execute(...args: [TQuery]): Promise<TResult> {
        const key = JSON.stringify(args[0])
        const currentTime = new Date().getTime()
        const cacheEntry = cache.get(key)
        const isCacheValid = cacheEntry && currentTime <= cacheEntry.timeout

        if (isCacheValid) {
          return cacheEntry.result
        }

        const result = await useCase.execute(...args)

        cache.set(key, {
          result,
          timeout: options?.timeout ? currentTime + options.timeout : Infinity,
        })

        return result
      },
    }
  }
}
