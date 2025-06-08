import { create, Mutate, StoreApi } from 'zustand';
import { persist } from 'zustand/middleware';

type LiteLLMConfigStore = {
  baseUrl: string;
  setBaseUrl: (url: string) => void;
};

type StoreWithPersist = Mutate<
  StoreApi<LiteLLMConfigStore>,
  [['zustand/persist', { baseUrl: string }]]
>;

export const withStorageDOMEvents = (store: StoreWithPersist) => {
  const storageEventCallback = (e: StorageEvent) => {
    if (e.key === store.persist.getOptions().name && e.newValue) {
      store.persist.rehydrate();
    }
  };
  window.addEventListener('storage', storageEventCallback);
  return () => window.removeEventListener('storage', storageEventCallback);
};

export const useLiteLLMConfigStore = create<LiteLLMConfigStore>()(
  persist(
    (set) => ({
      baseUrl: '',
      setBaseUrl: (url) => set({ baseUrl: url }),
    }),
    {
      name: 'litellm-config',
      partialize: (state) => ({ baseUrl: state.baseUrl }),
    }
  )
);

withStorageDOMEvents(useLiteLLMConfigStore);