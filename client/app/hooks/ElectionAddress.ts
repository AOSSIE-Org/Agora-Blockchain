import { create } from 'zustand'

type ElectionAddress = {
  electionAddress: `0x${string}` | undefined 
  setelectionAddress: (electionAddress :`0x${string}` ) => void
}
export const useElectionAddress = create<ElectionAddress>(
    (set) => ({
          electionAddress: undefined ,
          setelectionAddress: (electionAddress :any) => set(() => ({ electionAddress })),
        })
)