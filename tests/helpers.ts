import { expect, Mock } from 'vitest'

export function expectVOEquality<TProps>(
  voType: unknown,
  actual: TProps,
  expected: TProps,
  props: (keyof TProps)[]
) {
  expect(actual).toBeInstanceOf(voType)

  for (const prop of props) {
    expect(actual[prop]).toEqual(expected[prop])
  }
}

export function expectCalledWithVO<TProps>(
  voType: unknown,
  mockFn: Mock,
  expected: TProps,
  props: (keyof TProps)[]
) {
  const callArgs = mockFn.mock.calls[mockFn.mock.calls.length - 1][0]
  expectVOEquality(voType, callArgs, expected, props)
}
