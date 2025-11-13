import { beforeEach, describe, expect, it } from 'vitest'
import OffersService from '@admin/application/services/offers-service'
import Offer from '@admin/domain/offer'
import OfferNotFoundError from '@admin/application/errors/offer-not-found-error'
import { OfferView } from '@admin/application/acl/offer'
import {
  adminOffersStub,
  OfferStub,
  offersFromStub,
  offerFromStub,
} from '@tests/doubles/stubs/offers'
import mockOffersRepository, {
  MockedOffersRepository,
} from '@tests/doubles/mocks/admin/mock-offers-repository'

function expectOfferViewToMatch(offerView: OfferView, expectedStub: OfferStub) {
  expect(offerView.id).toBe(expectedStub.id)
  expect(offerView.from).toBe(expectedStub.from)
  expect(offerView.to).toBe(expectedStub.to)
  expect(offerView.date).toEqual(expectedStub.date)
  expect(offerView.price).toBe(expectedStub.price)
  expect(offerView.airline).toBe(expectedStub.airline)
  expect(offerView.travelClass).toBe(expectedStub.travelClass)
}

describe('OffersService', function () {
  let offersRepository: MockedOffersRepository
  let offersService: OffersService

  beforeEach(function () {
    offersRepository = mockOffersRepository()
    offersService = new OffersService(offersRepository)
  })

  describe('getAll', function () {
    it('should get all offers', async function () {
      offersRepository.findAll.mockResolvedValue(
        offersFromStub(adminOffersStub)
      )

      const offers = await offersService.getAll()

      expect(offers).toHaveLength(3)
      expectOfferViewToMatch(offers[0], adminOffersStub[0])
      expectOfferViewToMatch(offers[1], adminOffersStub[1])
      expectOfferViewToMatch(offers[2], adminOffersStub[2])
    })
  })

  describe('getById', function () {
    it('should return null for non-existing offer', async function () {
      offersRepository.findById.mockResolvedValue(null)

      const offer = await offersService.getById('non-existing-id')

      expect(offer).toBeNull()
    })

    it('should get an offer by ID', async function () {
      offersRepository.findById.mockResolvedValue(
        offerFromStub(adminOffersStub[0])
      )

      const offer = await offersService.getById('1')

      expect(offer).not.toBeNull()
      expectOfferViewToMatch(offer!, adminOffersStub[0])
    })
  })

  describe('add', function () {
    it('should add a new offer', async function () {
      offersRepository.add.mockImplementation((offer) =>
        Promise.resolve(
          Offer.rehydrate({
            id: 'new-id',
            from: offer.from,
            to: offer.to,
            date: offer.date,
            price: offer.price,
            airline: offer.airline,
            travelClass: offer.travelClass,
          })
        )
      )

      const newOffer = await offersService.add(adminOffersStub[0])

      expect(newOffer).toBeDefined()
      expect(newOffer.id).toBe('new-id')
      expectOfferViewToMatch(newOffer, {
        ...adminOffersStub[0],
        id: 'new-id',
      })
    })
  })

  describe('update', function () {
    it('should update an existing offer', async function () {
      offersRepository.update.mockImplementation((offer) =>
        Promise.resolve(
          Offer.rehydrate({
            id: offer.id,
            from: offer.from,
            to: offer.to,
            date: offer.date,
            price: offer.price,
            airline: offer.airline,
            travelClass: offer.travelClass,
          })
        )
      )
      const offerData = adminOffersStub[0]
      const updatedOffer = await offersService.update({
        ...offerData,
        price: 200,
      })
      expect(updatedOffer).toBeDefined()
      expect(updatedOffer.id).toBe(offerData.id)
      expect(updatedOffer.price).toBe(200)
      expectOfferViewToMatch(updatedOffer, { ...offerData, price: 200 })
    })

    it('should throw an error when trying to update a non-existing offer', async function () {
      offersRepository.update.mockImplementation(() =>
        Promise.reject(new OfferNotFoundError('Offer not found'))
      )
      const offerData = adminOffersStub[0]

      await expect(
        offersService.update({
          ...offerData,
          price: 200,
        })
      ).rejects.toThrow(OfferNotFoundError)
    })
  })
})
