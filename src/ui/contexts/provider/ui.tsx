import { ReactNode, useCallback, useMemo, useState } from 'react'
import { NotificationData, notifications } from '@mantine/notifications'
import { useDisclosure } from '@mantine/hooks'
import { uiContext } from '../ui'
import { PurchasedTravel } from '@/ui/contracts/travel'

/**
 * Helper hook to manage modal context state.
 * @param initialParams Initial params for the modal context.
 * @returns Modal context with state and handlers.
 */
function useModalContext<TParams extends object = object>(
  initialParams: TParams = {} as TParams
) {
  const [opened, { open, close }] = useDisclosure(false)
  const [params, setParams] = useState<TParams>(initialParams)

  const openModal = useCallback(
    (newParams?: TParams) => {
      if (newParams !== undefined) {
        setParams(newParams)
      }

      open()
    },
    [setParams, open]
  )

  return useMemo(
    () => ({
      opened,
      open: openModal,
      close,
      params,
      setParams,
    }),
    [opened, openModal, close, params, setParams]
  )
}

/**
 * UIProvider component to supply UI context to its children.
 * Manages modals, notifications, and search criteria.
 * @param props
 * @returns
 */
export default function UIProvider(props: { children: ReactNode }) {
  const loginModal = useModalContext()
  const renameModal = useModalContext({
    travel: null as PurchasedTravel | null,
  })
  const congratulationsModal = useModalContext()

  const notify = useCallback((notification: NotificationData) => {
    notifications.show(notification)
  }, [])

  return (
    <uiContext.Provider
      value={{
        loginModal,
        renameModal,
        congratulationsModal,
        notify,
      }}
    >
      {props.children}
    </uiContext.Provider>
  )
}
