import { create, Mutate, StoreApi } from 'zustand';
import { persist } from 'zustand/middleware';

export const PROVIDERS = ['google', 'openrouter', 'openai'] as const;
export type Provider = (typeof PROVIDERS)[number];

type APIKeys = Record<Provider, string>;

type APIKeyStore = {
  keys: APIKeys;
  setKeys: (newKeys: Partial<APIKeys>) => void;
  hasRequiredKeys: () => boolean;
  getKey: (provider: Provider) => string | null;
  getFirstAvailableKey: () => { provider: Provider; key: string } | null;
};

type StoreWithPersist = Mutate<
  StoreApi<APIKeyStore>,
  [['zustand/persist', { keys: APIKeys }]]
>;

export const withStorageDOMEvents = (store: StoreWithPersist) => {
  const storageEventCallback = (e: StorageEvent) => {
    if (e.key === store.persist.getOptions().name && e.newValue) {
      store.persist.rehydrate();
    }
  };

  window.addEventListener('storage', storageEventCallback);

  return () => {
    window.removeEventListener('storage', storageEventCallback);
  };
};

export const useAPIKeyStore = create<APIKeyStore>()(
  persist(
    (set, get) => ({
      keys: {
        google: '',
        openrouter: '',
        openai: '',
      },

      setKeys: (newKeys) => {
        set((state) => ({
          keys: { ...state.keys, ...newKeys },
        }));
      },

      hasRequiredKeys: () => {
        const keys = get().keys;
        return !!keys.google || !!keys.openrouter || !!keys.openai;
      },

      getKey: (provider) => {
        const key = get().keys[provider];
        return key ? key : null;
      },

      getFirstAvailableKey: () => {
        const keys = get().keys;
        if (keys.google) return { provider: 'google' as Provider, key: keys.google };
        if (keys.openai) return { provider: 'openai' as Provider, key: keys.openai };
        if (keys.openrouter) return { provider: 'openrouter' as Provider, key: keys.openrouter };
        return null;
      },
    }),
    {
      name: 'api-keys',
      partialize: (state) => ({ keys: state.keys }),
    }
  )
);

withStorageDOMEvents(useAPIKeyStore);
