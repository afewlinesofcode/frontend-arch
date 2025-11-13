import { useCallback } from 'react'
import LastMinuteDeal from '@ui/components/LastMinuteDeal'
import { LastMinuteDeal as LastMinuteDealType } from '@/ui/contracts/travel'
import { useAppContext } from '../contexts/app'
import { useUIContext } from '../contexts/ui'
import classes from './LastMinuteDeals.module.css'
import { Flex, ScrollArea } from '@mantine/core'

/**
 * Callback to handle last minute deal purchase.
 * If the user is not logged in, opens the login modal.
 * If the user is logged in, proceeds with the purchase.
 * @returns
 */
function usePurchaseCallback() {
  const { loginModal, congratulationsModal } = useUIContext()
  const { api, auth } = useAppContext()
  const isLoggedIn = auth.useSession() !== null

  return useCallback(
    async (card: LastMinuteDealType) => {
      void card // to avoid unused variable linting error

      if (!isLoggedIn) {
        loginModal.open()
        return
      }

      await api.travel.purchaseLastMinuteDeal({
        lastMinuteDealId: card.id,
      })
      congratulationsModal.open()
    },
    [api, isLoggedIn, loginModal, congratulationsModal]
  )
}

export default function LastMinuteDeals() {
  const { travel } = useAppContext()
  const cards = travel.useLastMinuteDeals()
  const purchase = usePurchaseCallback()

  return (
    <div className={classes.container}>
      {cards.length > 0 && <h2>Last Minute Deals</h2>}
      <ScrollArea>
        <Flex direction="row">
          {cards.map((card, index) => (
            <div key={index}>
              <LastMinuteDeal card={card} onClick={() => purchase(card)} />
            </div>
          ))}
        </Flex>
      </ScrollArea>
    </div>
  )
}
