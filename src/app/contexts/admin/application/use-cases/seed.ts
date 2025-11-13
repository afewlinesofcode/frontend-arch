import { travelClasses } from '../../../../shared/types/travel-class'
import Offer from '../../domain/offer'
import SpecialOffer from '../../domain/special-offer'
import OffersRepository from '../ports/offers-repository'
import SpecialOffersRepository from '../ports/special-offers-repository'

export default class Seed {
  public constructor(
    private offersRepository: OffersRepository,
    private specialOffersRepository: SpecialOffersRepository
  ) {}

  public async execute(): Promise<void> {
    this.specialOffersRepository.clear()
    this.offersRepository.clear()

    const locations = [
      'New York',
      'Los Angeles',
      'Chicago',
      'Houston',
      'Miami',
      'San Francisco',
      'Seattle',
      'Boston',
      'Denver',
      'Atlanta',
    ]

    const airlines = [
      'Delta Air Lines',
      'American Airlines',
      'United Airlines',
      'Southwest Airlines',
      'JetBlue Airways',
      'Alaska Airlines',
      'Spirit Airlines',
      'Frontier Airlines',
      'Hawaiian Airlines',
      'Virgin America',
    ]

    const hour = 60 * 60 * 1000
    const period = [new Date(), new Date(Date.now() + 30 * 24 * hour)] // Next month

    for (let iFrom = 0; iFrom < locations.length; iFrom++) {
      for (let iTo = 0; iTo < locations.length; iTo++) {
        if (iFrom === iTo) continue

        const numberOfOffers = Math.floor(Math.random() * 10) + 5 // 5 to 15 offers

        for (let i = 0; i < numberOfOffers; i++) {
          const from = locations[iFrom]
          const to = locations[iTo]
          const date = new Date(
            period[0].getTime() +
              Math.random() * (period[1].getTime() - period[0].getTime())
          )
          date.setMinutes(0, 0, 0)

          const price = parseFloat((100 + Math.random() * 900).toFixed(2)) // Between 100 and 1000
          const airline = airlines[Math.floor(Math.random() * airlines.length)]
          const travelClass =
            travelClasses[Math.floor(Math.random() * travelClasses.length)]

          const offer = await this.offersRepository.add(
            Offer.create({
              from,
              to,
              date,
              price,
              airline,
              travelClass,
            })
          )

          const needsSpecialOffer = Math.random() < 0.02 // 2% chance

          if (needsSpecialOffer) {
            await this.specialOffersRepository.add(
              SpecialOffer.create({
                offerId: offer.id,
                specialPrice: parseFloat(
                  (price * (0.7 + Math.random() * 0.2)).toFixed(2)
                ), // Between 70% and 90% of the original price
                description: `Special deal on ${from} to ${to} with ${airline}`,
              })
            )
          }
        }
      }
    }
  }
}
