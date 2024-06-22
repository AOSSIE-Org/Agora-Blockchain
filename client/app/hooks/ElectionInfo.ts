import { create } from 'zustand'

type ElectionInfo = {
  electionInfo: any
  setelectionInfo: (electionInfo :any) => void
}
export const useElectionStore = create<ElectionInfo>(
    (set) => ({
          electionInfo: undefined,
          setelectionInfo: (electionInfo :any) => set(() => ({ electionInfo })),
        })
)