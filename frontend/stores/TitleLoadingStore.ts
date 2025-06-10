import { create } from 'zustand';

type TitleLoadingStore = {
  loadingThreads: Set<string>;
  setLoading: (threadId: string, isLoading: boolean) => void;
  isLoading: (threadId: string) => boolean;
};

export const useTitleLoadingStore = create<TitleLoadingStore>((set, get) => ({
  loadingThreads: new Set(),

  setLoading: (threadId, isLoading) => {
    set((state) => {
      const newSet = new Set(state.loadingThreads);
      if (isLoading) {
        newSet.add(threadId);
      } else {
        newSet.delete(threadId);
      }
      return { loadingThreads: newSet };
    });
  },

  isLoading: (threadId) => {
    return get().loadingThreads.has(threadId);
  },
}));