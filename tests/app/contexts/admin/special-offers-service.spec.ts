import { beforeEach, describe, expect, it } from 'vitest'
import ReferentialIntegrityError from '@app/shared/errors/referential-integrity-error'
import SpecialOfferNotFoundError from '@admin/application/errors/special-offer-not-found-error'
import SpecialOffersService from '@admin/application/services/special-offers-service'
import { SpecialOfferView } from '@admin/application/acl/special-offer'
import mockSpecialOffersRepository, {
  MockedSpecialOffersRepository,
} from '@tests/doubles/mocks/admin/mock-special-offers-repository'
import mockOffersRepository, {
  MockedOffersRepository,
} from '@tests/doubles/mocks/admin/mock-offers-repository'
import {
  adminOffersStub,
  OfferStub,
  offersFromStub,
  offerFromStub,
} from '@tests/doubles/stubs/offers'
import {
  specialOffersStub,
  SpecialOfferStub,
  specialOffersFromStub,
} from '@tests/doubles/stubs/special-offers'

function expectSpecialOfferToMatch(
  specialOfferView: SpecialOfferView,
  expectedSpecialOfferStub: SpecialOfferStub,
  expectedOfferStub: OfferStub
) {
  expect(specialOfferView).toEqual({
    ...expectedSpecialOfferStub,
    offer: {
      ...expectedOfferStub,
    },
  })
}

describe('SpecialOffersService', function () {
  let specialOffersRepository: MockedSpecialOffersRepository
  let offersRepository: MockedOffersRepository
  let specialOffersService: SpecialOffersService

  beforeEach(function () {
    specialOffersRepository = mockSpecialOffersRepository()
    offersRepository = mockOffersRepository()
    specialOffersService = new SpecialOffersService(
      specialOffersRepository,
      offersRepository
    )

    offersRepository.findByIds.mockResolvedValue(
      offersFromStub(adminOffersStub)
    )

    offersRepository.findById.mockImplementation(async (id: string) => {
      const offer = adminOffersStub.find((o) => o.id === id)
      return offer ? offerFromStub(offer) : null
    })

    offersRepository.findByIds.mockImplementation(async (ids: string[]) => {
      const foundOffers = adminOffersStub.filter((o) => ids.includes(o.id))
      return offersFromStub(foundOffers)
    })
  })

  describe('getAll', function () {
    it('should get all special offers', async function () {
      specialOffersRepository.findAll.mockResolvedValue(
        specialOffersFromStub(specialOffersStub)
      )

      const specialOffersViews = await specialOffersService.getAll()

      expect(specialOffersViews).toHaveLength(2)
      expectSpecialOfferToMatch(
        specialOffersViews[0],
        specialOffersStub[0],
        adminOffersStub[0]
      )
      expectSpecialOfferToMatch(
        specialOffersViews[1],
        specialOffersStub[1],
        adminOffersStub[2]
      )
    })
  })

  describe('getById', function () {
    it('should return null for non-existing special offer', async function () {
      specialOffersRepository.findById.mockResolvedValue(null)

      const specialOffer = await specialOffersService.getById('non-existing-id')

      expect(specialOffer).toBeNull()
    })

    it('should get a special offer by ID', async function () {
      specialOffersRepository.findById.mockResolvedValue(
        specialOffersFromStub([specialOffersStub[0]])[0]
      )

      const specialOfferView = await specialOffersService.getById('1')

      expect(specialOfferView).toBeDefined()
      expectSpecialOfferToMatch(
        specialOfferView!,
        specialOffersStub[0],
        adminOffersStub[0]
      )
    })
  })

  describe('post', function () {
    it('should add a new special offer', async function () {
      specialOffersRepository.add.mockImplementation((specialOffer) =>
        Promise.resolve({
          id: 'new-special-offer-id',
          offerId: specialOffer.offerId,
          specialPrice: specialOffer.specialPrice,
          description: specialOffer.description,
        })
      )

      const newSpecialOfferView = await specialOffersService.add({
        offerId: '3',
        description: 'Special discount',
        specialPrice: 9.99,
      })

      expect(newSpecialOfferView).toBeDefined()
      expectSpecialOfferToMatch(
        newSpecialOfferView,
        {
          id: 'new-special-offer-id',
          offerId: '3',
          description: 'Special discount',
          specialPrice: 9.99,
        },
        adminOffersStub[2]
      )
    })
  })

  describe('update', function () {
    it('should update an existing special offer', async function () {
      specialOffersRepository.update.mockImplementation((specialOffer) =>
        Promise.resolve({
          id: specialOffer.id,
          offerId: specialOffer.offerId,
          specialPrice: specialOffer.specialPrice,
          description: specialOffer.description,
        })
      )

      const updatedSpecialOfferView = await specialOffersService.update({
        id: '1',
        offerId: '1',
        description: 'Updated special offer',
        specialPrice: 79.99,
      })

      expect(updatedSpecialOfferView).toBeDefined()
      expectSpecialOfferToMatch(
        updatedSpecialOfferView,
        {
          id: '1',
          offerId: '1',
          description: 'Updated special offer',
          specialPrice: 79.99,
        },
        adminOffersStub[0]
      )
    })

    it('should throw an error when trying to update a special offer with non-existing offerId', async function () {
      await expect(() =>
        specialOffersService.update({
          id: '1',
          offerId: 'non-existing-offer-id',
          description: 'Updated special offer',
          specialPrice: 79.99,
        })
      ).rejects.toThrow(ReferentialIntegrityError)
    })

    it('should throw an error when trying to update a special offer with non-existing id', async function () {
      specialOffersRepository.update.mockImplementation(() =>
        Promise.reject(new SpecialOfferNotFoundError('Special offer not found'))
      )
      await expect(() =>
        specialOffersService.update({
          id: 'non-existing-id',
          offerId: '1',
          description: 'Updated special offer',
          specialPrice: 79.99,
        })
      ).rejects.toThrow(SpecialOfferNotFoundError)
    })
  })
})
