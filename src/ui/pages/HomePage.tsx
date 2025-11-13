import LastMinuteDeals from '../containers/LastMinuteDeals'
import RecentSearches from '../containers/RecentSearches'
import TravelCards from '../containers/TravelCards'

export default function HomePage() {
  return (
    <>
      <RecentSearches />

      <LastMinuteDeals />

      <TravelCards />
    </>
  )
}
