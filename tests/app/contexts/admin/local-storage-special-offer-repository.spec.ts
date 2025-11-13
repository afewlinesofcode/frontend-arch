import { beforeEach, describe, expect, it } from 'vitest'
import SpecialOffer from '@admin/domain/special-offer'
import LocalStorageSpecialOfferRepository from '@admin/infrastructure/local-storage/special-offer-repository'
import SpecialOfferNotFoundError from '@admin/application/errors/special-offer-not-found-error'

describe('LocalStorageSpecialOfferRepository', () => {
  beforeEach(() => {
    localStorage.removeItem('specialOffers')
  })

  it('should load special offers from local storage on initialization', async () => {
    const storedSpecialOffers = [
      {
        id: '1',
        offer_id: 'offer-1',
        special_price: 250,
        description: 'Special discount for offer 1',
      },
      {
        id: '2',
        offer_id: 'offer-2',
        special_price: 400,
        description: 'Special discount for offer 2',
      },
    ]

    localStorage.setItem('specialOffers', JSON.stringify(storedSpecialOffers))
    const repository = new LocalStorageSpecialOfferRepository()
    const specialOffers = await repository.findAll()

    expect(specialOffers).toHaveLength(2)

    expect(specialOffers[0].id).toBe('1')
    expect(specialOffers[0].offerId).toBe('offer-1')
    expect(specialOffers[0].specialPrice).toBe(250)
    expect(specialOffers[0].description).toBe('Special discount for offer 1')

    expect(specialOffers[1].id).toBe('2')
    expect(specialOffers[1].offerId).toBe('offer-2')
    expect(specialOffers[1].specialPrice).toBe(400)
    expect(specialOffers[1].description).toBe('Special discount for offer 2')
  })

  it('should return null when finding a non-existing special offer by ID', async () => {
    const repository = new LocalStorageSpecialOfferRepository()
    const specialOffer = await repository.findById('non-existing-id')
    expect(specialOffer).toBeNull()
  })

  it('should find an existing special offer by ID', async () => {
    const storedSpecialOffers = [
      {
        id: '1',
        offer_id: 'offer-1',
        special_price: 250,
        description: 'Special discount for offer 1',
      },
      {
        id: '2',
        offer_id: 'offer-2',
        special_price: 400,
        description: 'Special discount for offer 2',
      },
    ]

    localStorage.setItem('specialOffers', JSON.stringify(storedSpecialOffers))
    const repository = new LocalStorageSpecialOfferRepository()
    const specialOffer = await repository.findById('2')

    expect(specialOffer).not.toBeNull()
    expect(specialOffer!.id).toBe('2')
    expect(specialOffer!.offerId).toBe('offer-2')
    expect(specialOffer!.specialPrice).toBe(400)
    expect(specialOffer!.description).toBe('Special discount for offer 2')
  })

  it('should save a new special offer to local storage', async () => {
    const repository = new LocalStorageSpecialOfferRepository()
    const specialOfferDraft = SpecialOffer.create({
      offerId: 'offer-3',
      specialPrice: 350,
      description: 'Special discount for offer 3',
    })
    const newSpecialOffer = await repository.add(specialOfferDraft)

    expect(newSpecialOffer.id).not.toBeNull()
    expect(newSpecialOffer.offerId).toBe('offer-3')
    expect(newSpecialOffer.specialPrice).toBe(350)
    expect(newSpecialOffer.description).toBe('Special discount for offer 3')

    const specialOffers = JSON.parse(
      localStorage.getItem('specialOffers') || '[]'
    )
    expect(specialOffers).toHaveLength(1)
    expect(specialOffers[0]).toEqual({
      id: newSpecialOffer.id,
      offer_id: 'offer-3',
      special_price: 350,
      description: 'Special discount for offer 3',
    })
  })

  it('should update an existing special offer in local storage', async () => {
    const storedSpecialOffers = [
      {
        id: 'existing-id',
        offer_id: 'offer-1',
        special_price: 250,
        description: 'Special discount for offer 1',
      },
    ]
    localStorage.setItem('specialOffers', JSON.stringify(storedSpecialOffers))

    const repository = new LocalStorageSpecialOfferRepository()
    const specialOffer = (await repository.findById('existing-id'))!
    specialOffer.patch({
      offerId: specialOffer.offerId,
      specialPrice: 300,
      description: 'Updated special discount for offer 1',
    })
    const updatedSpecialOffer = await repository.update(specialOffer)

    expect(updatedSpecialOffer.id).toBe('existing-id')
    expect(updatedSpecialOffer.offerId).toBe('offer-1')
    expect(updatedSpecialOffer.specialPrice).toBe(300)
    expect(updatedSpecialOffer.description).toBe(
      'Updated special discount for offer 1'
    )

    const specialOffers = JSON.parse(
      localStorage.getItem('specialOffers') || '[]'
    )
    expect(specialOffers).toHaveLength(1)
    expect(specialOffers[0]).toEqual({
      id: 'existing-id',
      offer_id: 'offer-1',
      special_price: 300,
      description: 'Updated special discount for offer 1',
    })
  })

  it('should throw an error when updating a non-existing special offer', async () => {
    const repository = new LocalStorageSpecialOfferRepository()
    const notExistingSpecialOffer = SpecialOffer.rehydrate({
      id: 'non-existing-id',
      offerId: 'offer-99',
      specialPrice: 999,
      description: 'Non-existing special offer',
    })
    await expect(
      repository.update(notExistingSpecialOffer)
    ).rejects.toThrowError(SpecialOfferNotFoundError)
  })
})
