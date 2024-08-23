import { create } from "zustand";

type HashIPFS = {
  hashIPFS: any;
  sethashIPFS: (hashIPFS: any) => void;
};
export const useHashIPFS = create<HashIPFS>((set) => ({
  hashIPFS: null,
  sethashIPFS: (hashIPFS: any) => set(() => ({ hashIPFS })),
}));
