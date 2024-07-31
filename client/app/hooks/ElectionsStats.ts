import { create } from 'zustand'

type ElectionStats = {
    electionStats: any
  setelectionStats: (electionStats :any) => void
}
export const useElectionStats = create<ElectionStats>(
    (set) => ({
        electionStats: null,
          setelectionStats: (electionStats :any) => set(() => ({ electionStats })),
        })
)