import { describe, expect, it } from 'vitest'
import OfferDraft from '@admin/domain/offer-draft'
import Offer from '@admin/domain/offer'

describe('Offer entity', function () {
  it('should create offer draft', function () {
    const offerDraft = OfferDraft.create({
      from: 'NYC',
      to: 'LAX',
      date: new Date('2024-12-01'),
      price: 300,
      airline: 'Delta',
      travelClass: 'economy',
    })

    expect(offerDraft.from).toBe('NYC')
    expect(offerDraft.to).toBe('LAX')
    expect(offerDraft.date).toEqual(new Date('2024-12-01'))
    expect(offerDraft.price).toBe(300)
    expect(offerDraft.airline).toBe('Delta')
    expect(offerDraft.travelClass).toBe('economy')
  })

  it('should create offer draft with Offer.create', function () {
    const offerDraft = Offer.create({
      from: 'NYC',
      to: 'LAX',
      date: new Date('2024-12-01'),
      price: 300,
      airline: 'Delta',
      travelClass: 'economy',
    })

    expect(offerDraft.from).toBe('NYC')
    expect(offerDraft.to).toBe('LAX')
    expect(offerDraft.date).toEqual(new Date('2024-12-01'))
    expect(offerDraft.price).toBe(300)
    expect(offerDraft.airline).toBe('Delta')
    expect(offerDraft.travelClass).toBe('economy')
  })

  it('should rehydrate offer', function () {
    const offer = Offer.rehydrate({
      id: 'offer-123',
      from: 'NYC',
      to: 'LAX',
      date: new Date('2024-12-01'),
      price: 300,
      airline: 'Delta',
      travelClass: 'economy',
    })

    expect(offer.id).toBe('offer-123')
    expect(offer.from).toBe('NYC')
    expect(offer.to).toBe('LAX')
    expect(offer.date).toEqual(new Date('2024-12-01'))
    expect(offer.price).toBe(300)
    expect(offer.airline).toBe('Delta')
    expect(offer.travelClass).toBe('economy')
  })

  it('should patch offer', function () {
    const offer = Offer.rehydrate({
      id: 'offer-123',
      from: 'NYC',
      to: 'LAX',
      date: new Date('2024-12-01'),
      price: 300,
      airline: 'Delta',
      travelClass: 'economy',
    })

    offer.patch({
      price: 350,
      travelClass: 'business',
    })

    expect(offer.price).toBe(350)
    expect(offer.travelClass).toBe('business')
    expect(offer.from).toBe('NYC')
    expect(offer.to).toBe('LAX')
    expect(offer.date).toEqual(new Date('2024-12-01'))
    expect(offer.airline).toBe('Delta')
  })
})
