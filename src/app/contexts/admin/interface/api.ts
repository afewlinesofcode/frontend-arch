import OffersRepository from '../application/ports/offers-repository'
import SpecialOffersRepository from '../application/ports/special-offers-repository'
import OffersService from '../application/services/offers-service'
import SpecialOffersService from '../application/services/special-offers-service'
import Seed from '../application/use-cases/seed'

export default function composeApi(
  offersRepository: OffersRepository,
  specialOffersRepository: SpecialOffersRepository
) {
  const offers = new OffersService(offersRepository)
  const specialOffers = new SpecialOffersService(
    specialOffersRepository,
    offersRepository
  )
  const seed = new Seed(offersRepository, specialOffersRepository)

  return {
    offers,
    specialOffers,
    seed: () => seed.execute(),
  }
}
