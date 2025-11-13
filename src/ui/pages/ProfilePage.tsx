import { useEffect } from 'react'
import { useAppContext } from '../contexts/app'
import { useNavigate } from 'react-router'
import UserInfo from '../components/UserInfo'
import PurchasedTravels from '../containers/PurchasedTravels'

function useSessionWithAuthGuard() {
  const { auth } = useAppContext()
  const session = auth.useSession()
  const navigate = useNavigate()

  useEffect(() => {
    if (!session) {
      navigate('/')
    }
  }, [session, navigate])

  return session
}

export default function ProfilePage() {
  const session = useSessionWithAuthGuard()

  if (!session) {
    return null
  }

  return (
    <div>
      <UserInfo session={session} />

      <PurchasedTravels />
    </div>
  )
}
