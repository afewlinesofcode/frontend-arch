import { createContext, useContext } from 'react'
import { NotificationData } from '@mantine/notifications'
import { PurchasedTravel } from '@/ui/contracts/travel'

/**
 * Helper type for modal context.
 */
type ModalContext<TParams extends object = object> = {
  opened: boolean
  open: (params?: TParams) => void
  close: () => void
  params: TParams
  setParams: (params: TParams) => void
}

/**
 * The UI context for managing modals, notifications, and search criteria.
 */
export type UIContext = {
  /* Show a notification */
  notify: (notification: NotificationData) => void

  /* Access login modal context */
  loginModal: ModalContext

  /* Access rename modal context */
  renameModal: ModalContext<{ travel: PurchasedTravel | null }>

  /* Access congratulations modal context */
  congratulationsModal: ModalContext
}

export const uiContext = createContext<UIContext | null>(null)

export function useUIContext() {
  const context = useContext(uiContext)

  if (!context) {
    throw new Error('useUIContext must be used within an UIProvider')
  }

  return context
}
