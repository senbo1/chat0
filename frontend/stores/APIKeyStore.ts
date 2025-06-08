import { create, Mutate, StoreApi } from 'zustand';
import { persist } from 'zustand/middleware';

export const PROVIDERS = ['google', 'openrouter', 'openai', 'litellm'] as const;
export type Provider = (typeof PROVIDERS)[number];

type APIKeys = Record<Provider, string>;

type APIKeyStore = {
  keys: APIKeys;
  setKeys: (newKeys: Partial<APIKeys>) => void;
  hasRequiredKeys: () => boolean;
  getKey: (provider: Provider) => string | null;
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
        litellm: '',
      },

      setKeys: (newKeys) => {
        set((state) => ({
          keys: { ...state.keys, ...newKeys },
        }));
      },

      /**
       * Previously the application enforced that a Google (Gemini) key
       * must be present before any chat functionality could be used.
       * This hard-coded requirement has been removed.  The application
       * can now operate without *any* API keys; features that need a
       * specific provider key will fail gracefully at their own call-site.
       */
      hasRequiredKeys: () => {
        return true;
      },

      getKey: (provider) => {
        const key = get().keys[provider];
        return key ? key : null;
      },
    }),
    {
      name: 'api-keys',
      partialize: (state) => ({ keys: state.keys }),
    }
  )
);

withStorageDOMEvents(useAPIKeyStore);
