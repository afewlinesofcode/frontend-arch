import { describe, expect, it, vi } from 'vitest'
import SearchCriteria from '@travel/domain/search-criteria'
import SameOriginDestinationError from '@travel/domain/errors/same-origin-destination-error'

describe('SearchCriteria', function () {
  it('should rehydrate search criteria from props', function () {
    const criteria = SearchCriteria.rehydrate({
      from: 'NYC',
      to: 'LAX',
      travelClass: ['economy', 'business'],
    })

    expect(criteria.from).toBe('NYC')
    expect(criteria.to).toBe('LAX')
    expect(criteria.travelClass).toEqual(['economy', 'business'])
  })

  it('should use policy to validate search criteria on creation', function () {
    const mockPolicy = {
      validate: vi.fn(),
    }

    SearchCriteria.create(
      {
        from: 'NYC',
        to: 'LAX',
        travelClass: ['economy'],
      },
      mockPolicy
    )

    expect(mockPolicy.validate).toHaveBeenCalledWith({
      from: 'NYC',
      to: 'LAX',
      travelClass: ['economy'],
    })
  })

  it('should create search criteria with valid props and default policy', function () {
    const criteria = SearchCriteria.create({
      from: 'NYC',
      to: 'LAX',
      travelClass: ['economy', 'first'],
    })

    expect(criteria.from).toBe('NYC')
    expect(criteria.to).toBe('LAX')
    expect(criteria.travelClass).toEqual(['economy', 'first'])
  })

  it('should throw error when creating search criteria with same origin and destination', function () {
    expect(() =>
      SearchCriteria.create({
        from: 'NYC',
        to: 'NYC',
        travelClass: ['economy'],
      })
    ).toThrowError(SameOriginDestinationError)
  })
})
