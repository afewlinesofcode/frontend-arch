import { createSlice } from '@reduxjs/toolkit'
import Session from '../../application/contracts/session'

export type AuthState = typeof initialState

const initialState = {
  session: null as Session | null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setSession(state, action) {
      state.session = action.payload
    },

    clearSession(state) {
      state.session = null
    },
  },
  selectors: {
    getSession(state) {
      return state.session
    },
  },
})

export default authSlice
