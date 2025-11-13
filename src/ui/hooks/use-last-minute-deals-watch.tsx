import { Link } from 'react-router'
import { useAppContext } from '../contexts/app'
import { useUIContext } from '../contexts/ui'
import useUpdateEffect from './use-update-effect'

export default function useLastMinuteDealsWatch() {
  const { notify } = useUIContext()
  const { travel } = useAppContext()
  const lastMinuteDeals = travel.useNewLastMinuteDeals()

  useUpdateEffect(() => {
    if (lastMinuteDeals.length === 0) {
      return
    }

    notify({
      title: 'New Last Minute Deals Available!',
      message: (
        <span>
          Check them out <Link to="/">here</Link>!
        </span>
      ),
      color: 'blue',
    })
  }, [lastMinuteDeals, notify, travel])
}
