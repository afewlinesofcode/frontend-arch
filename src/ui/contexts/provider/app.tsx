import { ReactNode } from 'react'
import { appContext } from '../app'
import composeDemo from '../demo/app'
// import composeWebApp from '@app/root/web-app'

/**
 * The provider component for the application context.
 * @param props The component props.
 * @returns The provider component.
 */
export default function AppProvider(props: { children: ReactNode }) {
  const root = composeDemo()
  // const root = composeWebApp()

  // Expose the app instance globally for debugging purposes
  ;(window as unknown as Window & { api: unknown }).api = root.api

  return (
    <appContext.Provider value={{ api: root.api, ...root.react }}>
      {props.children}
    </appContext.Provider>
  )
}
