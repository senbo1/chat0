import React, { useCallback, useEffect } from 'react';
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
import { useAPIKeyStore } from '@/frontend/stores/APIKeyStore';
import { Badge } from './ui/badge';

const formSchema = z.object({
  google: z.string().trim().optional(),
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
      />

      <ApiKeyField
        id="openrouter"
        label="OpenRouter API Key"
        models={['DeepSeek R1 0538', 'DeepSeek-V3']}
        linkUrl="https://openrouter.ai/settings/keys"
        placeholder="sk-or-..."
        register={register}
        error={errors.openrouter}
      />

      <ApiKeyField
        id="openai"
        label="OpenAI API Key"
        models={['GPT-4o', 'GPT-4.1-mini']}
        linkUrl="https://platform.openai.com/settings/organization/api-keys"
        placeholder="sk-..."
        register={register}
        error={errors.openai}
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

    <Input
      id={id}
      placeholder={placeholder}
      {...register(id as keyof FormValues)}
      className={error ? 'border-red-500' : ''}
    />

    <a
      href={linkUrl}
      target="_blank"
      className="text-sm text-blue-500 inline w-fit"
    >
      Create {label.split(' ')[0]} API Key
    </a>

    {error && (
      <p className="text-[0.8rem] font-medium text-red-500">{error.message}</p>
    )}
  </div>
);
