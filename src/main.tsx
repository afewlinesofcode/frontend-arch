import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import AppProvider from './ui/contexts/provider/app'
import UIProvider from './ui/contexts/provider/ui'
import AppComponent from './ui/containers/App'

createRoot(document.getElementById('root')!).render(
  <AppProvider>
    <UIProvider>
      <BrowserRouter>
        <MantineProvider>
          <Notifications position="top-center" />
          <AppComponent />
        </MantineProvider>
      </BrowserRouter>
    </UIProvider>
  </AppProvider>
)
