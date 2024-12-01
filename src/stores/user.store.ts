import { User } from 'firebase/auth'
import { create } from 'zustand'

type UserType = User | null

interface IUserStateStore {
	// isLoading: boolean
	user: UserType
	setUser: (user: UserType) => void
	// setIsLoading: (loading: boolean) => void
}

export const useUserState = create<IUserStateStore>(set => ({
	isLoading: true,
	user: null,
	// setIsLoading: isLoading => set({isLoading}),
	setUser: user => set({user}),
}))