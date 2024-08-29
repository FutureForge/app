import { create } from 'zustand'

interface SearchState {
  value: string
  setValue: (value: string) => void
}

export const useSearchStore = create<SearchState>((set) => ({
  value: '',
  setValue: (value: string) => set({ value }),
}))
