import authSlice, { AuthState } from './slice'

export default function composeHooks<TRootState>(
  selectSlice: (state: TRootState) => AuthState
) {
  const selectors = authSlice.getSelectors(selectSlice)

  return {
    useSession: selectors.getSession,
  }
}
