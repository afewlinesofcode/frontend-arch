/**
 * Generic type for a use case.
 */
export type UseCase<TArgs extends unknown[], TResult> = {
  execute(...args: TArgs): Promise<TResult>
}

/**
 * Extracts the executor function type from a UseCase.
 */
export type UseCaseExecutor<UseCase> = UseCase extends {
  execute: (...args: infer TArgs) => infer TResult
}
  ? (...args: TArgs) => TResult
  : never
