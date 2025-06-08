import { useEffect } from 'react';
import { useAPIKeyStore } from '@/frontend/stores/APIKeyStore';
import { useModelStore } from '@/frontend/stores/ModelStore';
import { AI_MODELS, getModelConfig } from '@/lib/models';

export const useAutoSelectModel = () => {
  const getKey = useAPIKeyStore((state) => state.getKey);
  const { selectedModel, setModel } = useModelStore();

  useEffect(() => {
    // Check if the currently selected model has a valid API key
    const currentModelConfig = getModelConfig(selectedModel);
    const currentApiKey = getKey(currentModelConfig.provider);

    if (!currentApiKey) {
      // Find the first model with an available API key
      const firstAvailableModel = AI_MODELS.find((model) => {
        const modelConfig = getModelConfig(model);
        const apiKey = getKey(modelConfig.provider);
        return !!apiKey;
      });

      if (firstAvailableModel && firstAvailableModel !== selectedModel) {
        setModel(firstAvailableModel);
      }
    }
  }, [getKey, selectedModel, setModel]);
};