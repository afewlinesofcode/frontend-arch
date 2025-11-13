import { useCallback } from 'react'
import { Grid } from '@mantine/core'
import TravelCard from '@ui/components/TravelCard'
import { TravelCard as TravelCardType } from '@/ui/contracts/travel'
import classes from './TravelCards.module.css'
import { useAppContext } from '../contexts/app'
import { useUIContext } from '../contexts/ui'

/**
 * Callback to handle travel card purchase.
 * If the user is not logged in, opens the login modal.
 * If the user is logged in, proceeds with the purchase.
 * @returns
 */
function usePurchaseCallback() {
  const { loginModal, congratulationsModal } = useUIContext()
  const { api, auth } = useAppContext()
  const isLoggedIn = auth.useSession() !== null

  return useCallback(
    async (card: TravelCardType) => {
      if (!isLoggedIn) {
        loginModal.open()
        return
      }

      await api.travel.purchaseTravel({ travelId: card.id })
      congratulationsModal.open()
    },
    [api, isLoggedIn, loginModal, congratulationsModal]
  )
}

/**
 * Travel cards container component.
 * Displays a grid of travel cards with purchase functionality.
 * @returns
 */
export default function TravelCards() {
  const { travel } = useAppContext()
  const cards = travel.useTravelCards()
  const purchase = usePurchaseCallback()

  return (
    <div className={classes.container}>
      {cards.length > 0 && <h2>Search results</h2>}
      <Grid className={classes.grid} gutter="md">
        {cards.map((card, index) => (
          <Grid.Col key={index} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
            <TravelCard card={card} onClick={() => purchase(card)} />
          </Grid.Col>
        ))}
      </Grid>
    </div>
  )
}
