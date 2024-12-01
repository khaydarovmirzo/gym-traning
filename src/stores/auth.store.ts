import { create } from 'zustand'

type AuthState = 'login' | 'register'

interface IAuthStoreStore {
	authState: AuthState
	setAuth: (state: AuthState) => void
}

export const useAuthState = create<IAuthStoreStore>((set) => ({
	authState: 'login',
	setAuth: state => set({authState: state})
}))