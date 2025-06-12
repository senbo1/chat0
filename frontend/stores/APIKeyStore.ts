import { create, Mutate, StoreApi } from 'zustand';
import { persist } from 'zustand/middleware';
import { validateAPIKey as validateAPIKeyService, APIValidationResult } from '@/lib/apiValidationService';

export const PROVIDERS = ['google', 'openrouter', 'openai'] as const;
export type Provider = (typeof PROVIDERS)[number];

type APIKeys = Record<Provider, string>;

type APIKeyStore = {
  keys: APIKeys;
  setKeys: (newKeys: Partial<APIKeys>) => void;
  hasRequiredKeys: () => boolean;
  getKey: (provider: Provider) => string | null;
  validateKeyAPI: (provider: Provider) => Promise<APIValidationResult>;
  validateAllKeysAPI: () => Promise<Record<Provider, APIValidationResult>>;
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
        return !!get().keys.google;
      },

      getKey: (provider) => {
        const key = get().keys[provider];
        return key ? key : null;
      },

      validateKeyAPI: async (provider) => {
        const key = get().keys[provider];
        if (!key || key.trim().length === 0) {
          return { isValid: false, error: `${provider} API key is required` };
        }
        return validateAPIKeyService(provider, key);
      },

      validateAllKeysAPI: async () => {
        const keys = get().keys;
        const results: Record<Provider, APIValidationResult> = {} as Record<Provider, APIValidationResult>;
        
        const validationPromises = PROVIDERS.map(async (provider) => {
          const key = keys[provider];
          if (key && key.trim().length > 0) {
            results[provider] = await validateAPIKeyService(provider, key);
          } else {
            results[provider] = { isValid: false, error: `${provider} API key is required` };
          }
        });

        await Promise.all(validationPromises);
        return results;
      },
    }),
    {
      name: 'api-keys',
      partialize: (state) => ({ keys: state.keys }),
    }
  )
);

withStorageDOMEvents(useAPIKeyStore);
