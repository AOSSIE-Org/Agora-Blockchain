import { create } from 'zustand'

type ElectionModal = {
  electionModal: boolean
  setelectionModal: (electionModal :any) => void
}
export const useElectionModal = create<ElectionModal>(
    (set) => ({
          electionModal: false,
          setelectionModal: (electionModal :any) => set(() => ({ electionModal })),
        })
)