import { create, Mutate, StoreApi } from 'zustand';
import { persist } from 'zustand/middleware';
import { AIModel, getModelConfig, ModelConfig, AI_MODELS } from '@/lib/models';

type ModelStore = {
  selectedModel: string;
  /**
   * Models returned by LiteLLM `/v1/models` in addition to the predefined list.
   */
  customModels: string[];
  /**
   * Combined list that powers the dropdown. (AI_MODELS + customModels)
   */
  models: string[];

  /**
   * LiteLLM specific configuration
   */
  liteLLM: {
    baseUrl: string;
  };

  setModel: (model: string) => void;
  setCustomModels: (models: string[]) => void;

  setLiteLLMBaseUrl: (url: string) => void;
  getLiteLLMBaseUrl: () => string;

  getModelConfig: () => ModelConfig;
};

type StoreWithPersist = Mutate<
  StoreApi<ModelStore>,
  [
    [
      'zustand/persist',
      { selectedModel: string; customModels: string[]; liteLLM: { baseUrl: string } }
    ]
  ]
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

export const useModelStore = create<ModelStore>()(
  persist(
    (set, get) => ({
      selectedModel: 'Gemini 2.5 Flash',
      customModels: [],
      models: [...AI_MODELS],
      liteLLM: { baseUrl: '' },

      setModel: (model) => {
        set({ selectedModel: model });
      },

      setCustomModels: (models) => {
        set((state) => ({
          customModels: models,
          models: [...AI_MODELS, ...models],
        }));
      },

      setLiteLLMBaseUrl: (url) => {
        set((state) => ({
          liteLLM: { ...state.liteLLM, baseUrl: url },
        }));
      },

      getLiteLLMBaseUrl: () => get().liteLLM.baseUrl,

      getModelConfig: () => {
        const { selectedModel } = get();
        return getModelConfig(selectedModel);
      },
    }),
    {
      name: 'model-store',
      partialize: (state) => ({
        selectedModel: state.selectedModel,
        customModels: state.customModels,
        liteLLM: state.liteLLM,
      }),
      // rebuild combined model list after persisted data are re-hydrated
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.models = [...AI_MODELS, ...(state.customModels ?? [])];
        }
      },
    }
  )
);

withStorageDOMEvents(useModelStore);
