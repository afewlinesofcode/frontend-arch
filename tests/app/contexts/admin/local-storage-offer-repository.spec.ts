import { describe, it, expect, beforeEach } from 'vitest'
import Offer from '@admin/domain/offer'
import LocalStorageOfferRepository from '@admin/infrastructure/local-storage/offer-repository'
import OfferNotFoundError from '@admin/application/errors/offer-not-found-error'

describe('LocalStorageOfferRepository', function () {
  beforeEach(function () {
    localStorage.removeItem('offers')
  })

  it.only('should load offers from local storage on initialization', async function () {
    const storedOffers = [
      {
        id: '1',
        from: 'New York',
        to: 'London',
        date: new Date('2023-10-01').toISOString(),
        price: 300,
        airline: 'Delta',
        travel_class: 'economy',
      },
    ]
    localStorage.setItem('offers', JSON.stringify(storedOffers))

    const repository = new LocalStorageOfferRepository()
    const offers = await repository.findAll()

    expect(offers).toHaveLength(1)
    expect(offers[0].id).toBe('1')
    expect(offers[0].from).toBe('New York')
    expect(offers[0].to).toBe('London')
    expect(offers[0].date).toEqual(new Date('2023-10-01'))
    expect(offers[0].price).toBe(300)
    expect(offers[0].airline).toBe('Delta')
    expect(offers[0].travelClass).toBe('economy')
  })

  it('should return null when finding a non-existing offer by ID', async function () {
    const repository = new LocalStorageOfferRepository()
    const offer = await repository.findById('non-existing-id')
    expect(offer).toBeNull()
  })

  it('should find an existing offer by ID', async function () {
    const storedOffers = [
      {
        id: '2',
        from: 'Paris',
        to: 'Berlin',
        date: new Date('2023-09-15').toISOString(),
        price: 150,
        airline: 'Air France',
        travel_class: 'economy',
      },
      {
        id: '3',
        from: 'Tokyo',
        to: 'Seoul',
        date: new Date('2023-10-20').toISOString(),
        price: 250,
        airline: 'Korean Air',
        travel_class: 'business',
      },
    ]
    localStorage.setItem('offers', JSON.stringify(storedOffers))

    const repository = new LocalStorageOfferRepository()
    const offer = await repository.findById('2')

    expect(offer).not.toBeNull()
    expect(offer!.id).toBe('2')
    expect(offer!.from).toBe('Paris')
    expect(offer!.to).toBe('Berlin')
    expect(offer!.date).toEqual(new Date('2023-09-15'))
    expect(offer!.price).toBe(150)
    expect(offer!.airline).toBe('Air France')
    expect(offer!.travelClass).toBe('economy')
  })

  it('should save a new offer to local storage', async function () {
    const repository = new LocalStorageOfferRepository()
    const offerDraft = Offer.create({
      from: 'San Francisco',
      to: 'Chicago',
      date: new Date('2023-11-15'),
      price: 200,
      airline: 'United',
      travelClass: 'business',
    })
    const newOffer = await repository.add(offerDraft)
    expect(newOffer.id).not.toBeNull()

    const offers = JSON.parse(localStorage.getItem('offers') || '[]')
    expect(offers).toHaveLength(1)
    expect(offers[0]).toEqual({
      id: newOffer.id,
      from: 'San Francisco',
      to: 'Chicago',
      date: new Date('2023-11-15').toISOString(),
      price: 200,
      airline: 'United',
      travel_class: 'business',
    })
  })

  it('should update an existing offer in local storage', async function () {
    localStorage.setItem(
      'offers',
      JSON.stringify([
        {
          id: 'existing-id',
          from: 'Manchester',
          to: 'Liverpool',
          date: new Date('2023-12-20').toISOString(),
          price: 150,
          airline: 'British Airways',
          travel_class: 'economy',
        },
      ])
    )
    const repository = new LocalStorageOfferRepository()
    const offer = (await repository.findById('existing-id'))!
    offer.patch({
      from: offer.from,
      to: 'Edinburgh',
      date: offer.date,
      price: 180,
      airline: offer.airline,
      travelClass: offer.travelClass,
    })
    const updatedOffer = await repository.update(offer)

    const offers = JSON.parse(localStorage.getItem('offers') || '[]')
    expect(offers).toHaveLength(1)
    expect(offers[0]).toEqual({
      id: 'existing-id',
      from: 'Manchester',
      to: 'Edinburgh',
      date: new Date('2023-12-20').toISOString(),
      price: 180,
      airline: 'British Airways',
      travel_class: 'economy',
    })
    expect(updatedOffer.id).toBe('existing-id')
    expect(updatedOffer.to).toBe('Edinburgh')
    expect(updatedOffer.price).toBe(180)
  })

  it('should throw an error when updating a non-existing offer', async function () {
    const repository = new LocalStorageOfferRepository()
    const notExistingOffer = Offer.rehydrate({
      id: 'non-existing-id',
      from: 'Miami',
      to: 'Orlando',
      date: new Date('2023-10-10'),
      price: 120,
      airline: 'American Airlines',
      travelClass: 'economy',
    })

    await expect(repository.update(notExistingOffer)).rejects.toThrowError(
      OfferNotFoundError
    )
  })
})
