import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import './App.css'
import SessionLayout from '../layouts/SessionLayout'
import { Route, Routes } from 'react-router'
import HomePage from '../pages/HomePage'
import ProfilePage from '../pages/ProfilePage'
import LoginModal from '../modals/LoginModal'
import RenameModal from '../modals/RenameModal'
import CongratulationsModal from '../modals/CongratulationsModal'
import useLastMinuteDealsWatch from '../hooks/use-last-minute-deals-watch'

export default function App() {
  useLastMinuteDealsWatch()

  return (
    <SessionLayout>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>

      <LoginModal />
      <RenameModal />
      <CongratulationsModal />
    </SessionLayout>
  )
}
