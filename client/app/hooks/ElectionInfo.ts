import { create } from "zustand";

type ElectionData = {
  electionData: any;
  setelectionData: (electionData: any) => void;
};
export const useElectionData = create<ElectionData>((set) => ({
  electionData: null,
  setelectionData: (electionData: any) => set(() => ({ electionData })),
}));
