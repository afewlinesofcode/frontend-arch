import composeAuth from './auth'
import composeTravel from './travel'

/**
 * Composition root for demo application.
 * @returns An object containing the demo app methods and react hooks.
 */
export default function composeDemo() {
  const auth = composeAuth()
  const travel = composeTravel()

  const demo = {
    api: {
      auth: auth.api,
      travel: travel.api,
    },
    react: {
      auth: auth.react,
      travel: travel.react,
    },
  }

  return demo
}
