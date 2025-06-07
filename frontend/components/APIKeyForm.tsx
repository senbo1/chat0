import React, { useCallback, useEffect } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FieldError, useForm, UseFormRegister } from 'react-hook-form';

import { Button } from '@/frontend/components/ui/button';
import { Input } from '@/frontend/components/ui/input';
import { Key, ExternalLink, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { useAPIKeyStore } from '@/frontend/stores/APIKeyStore';
import { Badge } from './ui/badge';

const formSchema = z.object({
  google: z.string().trim().min(1, {
    message: 'Google API key is required for Title Generation',
  }),
  openrouter: z.string().trim().optional(),
  openai: z.string().trim().optional(),
  anthropic: z.string().trim().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface APIKeyFormProps {
  selectedProviders?: string[];
}

export default function APIKeyForm({ selectedProviders }: APIKeyFormProps = {}) {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Key className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Configure Your AI Providers</h2>
        </div>
        <p className="text-muted-foreground">
          Add API keys for the AI models you want to use. Keys are stored securely in your browser and never sent to our servers.
        </p>
        
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="p-1.5 bg-primary/10 rounded-full">
              <Shield className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium">
                Privacy First
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Your API keys are stored locally and encrypted. We never have access to them.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Form selectedProviders={selectedProviders} />
    </div>
  );
}

const Form = ({ selectedProviders }: { selectedProviders?: string[] }) => {
  const { keys, setKeys } = useAPIKeyStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: keys,
  });

  useEffect(() => {
    reset(keys);
  }, [keys, reset]);

  const onSubmit = useCallback(
    (values: FormValues) => {
      setKeys(values);
      toast.success('API keys saved successfully');
    },
    [setKeys]
  );

  const providerFields = [
    {
      id: 'google',
      label: 'Google API Key',
      models: ['Gemini 2.5 Flash', 'Gemini 2.5 Pro'],
      linkUrl: 'https://aistudio.google.com/apikey',
      placeholder: 'AIza...',
      required: true,
    },
    {
      id: 'openai',
      label: 'OpenAI API Key',
      models: ['GPT-4o', 'GPT-4.1-mini'],
      linkUrl: 'https://platform.openai.com/settings/organization/api-keys',
      placeholder: 'sk-...',
      required: false,
    },
    {
      id: 'anthropic',
      label: 'Anthropic API Key',
      models: ['Claude 3.5 Sonnet', 'Claude 3.5 Haiku'],
      linkUrl: 'https://console.anthropic.com/settings/keys',
      placeholder: 'sk-ant-...',
      required: false,
    },
    {
      id: 'openrouter',
      label: 'OpenRouter API Key',
      models: ['Deepseek R1 0528', 'Deepseek V3'],
      linkUrl: 'https://openrouter.ai/settings/keys',
      placeholder: 'sk-or-...',
      required: false,
    },
  ];

  const fieldsToShow = selectedProviders 
    ? providerFields.filter(field => selectedProviders.includes(field.id))
    : providerFields;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        {fieldsToShow.map((field) => (
          <ApiKeyField
            key={field.id}
            id={field.id}
            label={field.label}
            models={field.models}
            linkUrl={field.linkUrl}
            placeholder={field.placeholder}
            register={register}
            error={errors[field.id as keyof FormValues]}
            required={field.required}
          />
        ))}
      </div>

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
  required,
  register,
}: ApiKeyFieldProps) => (
  <div className="space-y-3 p-4 border rounded-lg bg-background/50 hover:bg-background/80 transition-colors">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <label
          htmlFor={id}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
        </label>
        {required && <Badge variant="destructive" className="text-xs px-2 py-0.5">Required</Badge>}
      </div>
      <a
        href={linkUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-primary hover:text-primary/80 inline-flex items-center gap-1 hover:underline transition-colors"
      >
        Get API Key
        <ExternalLink className="w-3 h-3" />
      </a>
    </div>
    
    <div className="flex flex-wrap gap-1.5">
      {models.map((model) => (
        <Badge key={model} variant="outline" className="text-xs font-normal">{model}</Badge>
      ))}
    </div>

    <Input
      id={id}
      type="password"
      placeholder={placeholder}
      {...register(id as keyof FormValues)}
      className={`transition-colors ${error ? 'border-destructive focus-visible:ring-destructive' : ''}`}
    />

    {error && (
      <p className="text-sm font-medium text-destructive flex items-center gap-1.5">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        {error.message}
      </p>
    )}
  </div>
);
