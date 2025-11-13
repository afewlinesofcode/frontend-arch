import { describe, expect, it } from 'vitest'
import SpecialOfferDraft from '@admin/domain/special-offer-draft'
import SpecialOffer from '@admin/domain/special-offer'

describe('SpecialOffer entity', function () {
  it('should create special offer draft', function () {
    const specialOfferDraft = SpecialOfferDraft.create({
      offerId: 'offer-123',
      specialPrice: 199.99,
      description: 'Special holiday discount',
    })

    expect(specialOfferDraft.offerId).toBe('offer-123')
    expect(specialOfferDraft.specialPrice).toBe(199.99)
    expect(specialOfferDraft.description).toBe('Special holiday discount')
  })

  it('should create special offer draft with SpecialOffer.create', function () {
    const specialOfferDraft = SpecialOffer.create({
      offerId: 'offer-123',
      specialPrice: 199.99,
      description: 'Special holiday discount',
    })

    expect(specialOfferDraft.offerId).toBe('offer-123')
    expect(specialOfferDraft.specialPrice).toBe(199.99)
    expect(specialOfferDraft.description).toBe('Special holiday discount')
  })

  it('should rehydrate special offer', function () {
    const specialOffer = SpecialOffer.rehydrate({
      id: 'special-offer-123',
      offerId: 'offer-123',
      specialPrice: 199.99,
      description: 'Special holiday discount',
    })

    expect(specialOffer.id).toBe('special-offer-123')
    expect(specialOffer.offerId).toBe('offer-123')
    expect(specialOffer.specialPrice).toBe(199.99)
    expect(specialOffer.description).toBe('Special holiday discount')
  })

  it('should patch special offer', function () {
    const specialOffer = SpecialOffer.rehydrate({
      id: 'special-offer-123',
      offerId: 'offer-123',
      specialPrice: 199.99,
      description: 'Special holiday discount',
    })

    specialOffer.patch({
      specialPrice: 179.99,
      description: 'Updated holiday discount',
    })

    expect(specialOffer.specialPrice).toBe(179.99)
    expect(specialOffer.description).toBe('Updated holiday discount')
    expect(specialOffer.offerId).toBe('offer-123')
  })
})
