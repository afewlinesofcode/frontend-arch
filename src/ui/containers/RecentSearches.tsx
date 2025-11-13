import { useCallback } from 'react'
import { Grid } from '@mantine/core'
import RecentSearch from '@ui/components/RecentSearch'
import { SearchCriteria } from '@/ui/contracts/travel'
import { useAppContext } from '../contexts/app'
import { useUIContext } from '../contexts/ui'
import { useNavigate } from 'react-router'
import classes from './TravelCards.module.css'

function useSearchCallback() {
  const { api } = useAppContext()
  const { notify } = useUIContext()
  const navigate = useNavigate()

  return useCallback(
    async (criteria: SearchCriteria) => {
      try {
        await api.travel.searchTravels(criteria)
        navigate('/')
      } catch (e) {
        notify({
          color: 'red',
          title: 'Search error',
          message: (e as Error).message,
        })
      }
    },
    [api, navigate, notify]
  )
}

/**
 * Recent searches container
 * @returns
 */
export default function RecentSearches() {
  const { travel } = useAppContext()
  const recentSearches = travel.useRecentSearches()

  const search = useSearchCallback()

  return (
    <div>
      {recentSearches.length > 0 && <h2>Recent Searches</h2>}
      <Grid className={classes.grid} gutter="md">
        {recentSearches.map((recentSearch, index) => (
          <Grid.Col key={index} span={{ base: 12, xs: 6, md: 3 }}>
            <RecentSearch
              value={recentSearch}
              onClick={() => search(recentSearch)}
            />
          </Grid.Col>
        ))}
      </Grid>
    </div>
  )
}
