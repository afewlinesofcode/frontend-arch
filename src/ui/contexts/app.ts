import { createContext, useContext } from 'react'
import { AppContext } from '@/ui/contracts/app'
import composeDemo from './demo/app'
// import composeWebApp from '../../app/root/web-app'

/**
 * Type for the application providing API
 */
type Api = ReturnType<typeof composeDemo>['api']
// type Api = ReturnType<typeof composeWebApp>['api']

/**
 * The application context for the UI.
 */
export const appContext = createContext<AppContext<Api> | null>(null)

/**
 * Custom hook to access the application context.
 * @returns The application context.
 * @throws Error if used outside of an AppProvider.
 */
export function useAppContext() {
  const context = useContext(appContext)

  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider')
  }

  return context
}
