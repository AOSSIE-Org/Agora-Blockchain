import { create } from "zustand";

type ElectionFilter = {
  electionFilter: any;
  setelectionFilter: (electionFilter: any) => void;
};
export const useElectionFilter = create<ElectionFilter>((set) => ({
  electionFilter: null,
  setelectionFilter: (electionFilter: any) => set(() => ({ electionFilter })),
}));
