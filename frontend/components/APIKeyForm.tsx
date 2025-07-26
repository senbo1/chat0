import React, { useCallback, useEffect, useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FieldError, useForm, UseFormRegister } from 'react-hook-form';

import { Button } from '@/frontend/components/ui/button';
import { Input } from '@/frontend/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/frontend/components/ui/card';
import { Key } from 'lucide-react';
import { toast } from 'sonner';
import { useAPIKeyStore, Provider } from '@/frontend/stores/APIKeyStore';
import { Badge } from './ui/badge';
import { APIValidationResult, validateAPIKey as validateAPIKeyService } from '@/lib/apiValidationService';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

const formSchema = z.object({
  google: z.string().trim().min(1, {
    message: 'Google API key is required for Title Generation',
  }),
  openrouter: z.string().trim().optional(),
  openai: z.string().trim().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function APIKeyForm() {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          <CardTitle>Add Your API Keys To Start Chatting</CardTitle>
        </div>
        <CardDescription>
          Keys are stored locally in your browser.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form />
      </CardContent>
    </Card>
  );
}

const Form = () => {
  const { keys, setKeys } = useAPIKeyStore();
  const [apiValidationResults, setApiValidationResults] = useState<Record<string, APIValidationResult>>({});
  const [validatingKeys, setValidatingKeys] = useState<Set<string>>(new Set());

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: keys,
  });

  const watchedValues = watch();

  useEffect(() => {
    reset(keys);
  }, [keys, reset]);

  useEffect(() => {
    Object.keys(watchedValues).forEach(provider => {
      if (apiValidationResults[provider]) {
        setApiValidationResults(prev => {
          const newResults = { ...prev };
          delete newResults[provider];
          return newResults;
        });
      }
    });
  }, [watchedValues, apiValidationResults]);


  const validateWithAPI = useCallback(async (formValues: FormValues) => {
    const providersToValidate = Object.entries(formValues).filter(([, value]) => 
      value && value.trim().length > 0
    ) as [Provider, string][];

    setValidatingKeys(new Set(providersToValidate.map(([provider]) => provider)));
    
    const results: Record<string, APIValidationResult> = {};
    
    await Promise.all(
      providersToValidate.map(async ([provider, apiKey]) => {
        try {
          results[provider] = await validateAPIKeyService(provider, apiKey);
        } catch {
          results[provider] = { isValid: false, error: 'Validation failed' };
        }
      })
    );
    
    setApiValidationResults(results);
    setValidatingKeys(new Set());
    
    return results;
  }, []);

  const onSubmit = useCallback(
    async (values: FormValues) => {
      // First validate with APIs
      const validationResults = await validateWithAPI(values);
      
      // Check if any validation failed
      const hasErrors = Object.values(validationResults).some(result => !result.isValid);
      
      if (hasErrors) {
        toast.error('Please fix API key errors before saving');
        return;
      }
      
      // Only save if all validations pass
      setKeys(values);
      toast.success('API keys saved successfully');
    },
    [setKeys, validateWithAPI]
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <ApiKeyField
        id="google"
        label="Google API Key"
        models={['Gemini 2.5 Flash', 'Gemini 2.5 Pro']}
        linkUrl="https://aistudio.google.com/apikey"
        placeholder="AIza..."
        register={register}
        error={errors.google}
        apiValidation={apiValidationResults.google}
        isValidating={validatingKeys.has('google')}
        required
      />

      <ApiKeyField
        id="openrouter"
        label="OpenRouter API Key"
        models={['DeepSeek R1 0538', 'DeepSeek-V3']}
        linkUrl="https://openrouter.ai/settings/keys"
        placeholder="sk-or-..."
        register={register}
        error={errors.openrouter}
        apiValidation={apiValidationResults.openrouter}
        isValidating={validatingKeys.has('openrouter')}
      />

      <ApiKeyField
        id="openai"
        label="OpenAI API Key"
        models={['GPT-4o', 'GPT-4.1-mini']}
        linkUrl="https://platform.openai.com/settings/organization/api-keys"
        placeholder="sk-..."
        register={register}
        error={errors.openai}
        apiValidation={apiValidationResults.openai}
        isValidating={validatingKeys.has('openai')}
      />

      <Button type="submit" className="w-full" disabled={!isDirty}>
        Save API Keys
      </Button>
    </form>
  );
};

interface ApiKeyFieldProps {
  id: string;
  label: string;
  linkUrl: string;
  models: string[];
  placeholder: string;
  error?: FieldError | undefined;
  apiValidation?: APIValidationResult;
  isValidating?: boolean;
  required?: boolean;
  register: UseFormRegister<FormValues>;
}

const ApiKeyField = ({
  id,
  label,
  linkUrl,
  placeholder,
  models,
  error,
  apiValidation,
  isValidating,
  required,
  register,
}: ApiKeyFieldProps) => {
  const getInputClassName = () => {
    if (error) return 'border-red-500';
    if (apiValidation?.isValid === false) return 'border-red-500';
    if (apiValidation?.isValid === true) return 'border-green-500';
    return '';
  };

  const getValidationIcon = () => {
    if (isValidating) {
      return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
    }
    if (apiValidation?.isValid === true) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
    if (apiValidation?.isValid === false) {
      return <XCircle className="w-4 h-4 text-red-500" />;
    }
    return null;
  };

  return (
  <div className="flex flex-col gap-2">
    <label
      htmlFor={id}
      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex gap-1"
    >
      <span>{label}</span>
      {required && <span className="text-muted-foreground"> (Required)</span>}
    </label>
    <div className="flex gap-2">
      {models.map((model) => (
        <Badge key={model}>{model}</Badge>
      ))}
    </div>

    <div className="relative">
      <Input
        id={id}
        placeholder={placeholder}
        {...register(id as keyof FormValues)}
        className={getInputClassName()}
      />
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
        {getValidationIcon()}
      </div>
    </div>

    <a
      href={linkUrl}
      target="_blank"
      className="text-sm text-blue-500 inline w-fit"
    >
      Create {label.split(' ')[0]} API Key
    </a>

    {(error || (apiValidation && !apiValidation.isValid)) && (
      <p className="text-[0.8rem] font-medium text-red-500">
        {error?.message || apiValidation?.error}
      </p>
    )}
  </div>
  );
};
