import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { MessageSquare, Bot, Key, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import APIKeyForm from './APIKeyForm';
import { useAPIKeyStore } from '../stores/APIKeyStore';

const steps = [
  {
    id: 'welcome',
    title: 'Welcome to Chat0',
    description: 'Blazingly-Fast, Open-source, and Free AI Chat App.',
    icon: MessageSquare,
  },
  {
    id: 'providers',
    title: 'Choose AI Providers',
    description: 'Select which AI providers you want to use',
    icon: Bot,
  },
  {
    id: 'setup',
    title: 'Setup API Keys',
    description: 'Add your API keys to start chatting',
    icon: Key,
  },
  {
    id: 'complete',
    title: 'Ready to Chat!',
    description: 'Everything is set up. Start your first conversation.',
    icon: CheckCircle,
  },
];

const providers = [
  {
    id: 'google',
    name: 'Google Gemini',
    description: 'Advanced reasoning and long context understanding',
    models: ['Gemini 2.5 Flash', 'Gemini 2.5 Pro'],
    required: true,
  },
  {
    id: 'openai',
    name: 'OpenAI',
    description: 'Popular GPT models for general-purpose conversations',
    models: ['GPT-4o', 'GPT-4.1-mini'],
    required: false,
  },
  {
    id: 'anthropic',
    name: 'Anthropic Claude',
    description: 'Helpful, harmless, and honest AI assistant',
    models: ['Claude 3.5 Sonnet', 'Claude 3.5 Haiku', 'Claude 3.7 Sonnet'],
    required: false,
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    description: 'Access to various models through a single API',
    models: ['Deepseek R1 0528', 'Deepseek V3'],
    required: false,
  },
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedProviders, setSelectedProviders] = useState<string[]>(['google']); // Google is required
  const hasRequiredKeys = useAPIKeyStore((state) => state.hasRequiredKeys());

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };


  const toggleProvider = (providerId: string) => {
    if (providerId === 'google') return;
    
    setSelectedProviders(prev => 
      prev.includes(providerId)
        ? prev.filter(id => id !== providerId)
        : [...prev, providerId]
    );
  };

  React.useEffect(() => {
    if (currentStep === 2 && hasRequiredKeys) {
      setCurrentStep(3);
    }
  }, [hasRequiredKeys, currentStep]);

  const currentStepData = steps[currentStep];
  const Icon = currentStepData.icon;

  if (currentStep === 2) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full max-w-4xl pt-10 pb-44 mx-auto px-4">
        <div className="w-full max-w-2xl">
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" onClick={handlePrevious} className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index <= currentStep ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>
          <APIKeyForm selectedProviders={selectedProviders} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-full max-w-4xl pt-10 pb-44 mx-auto px-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center pb-6">
          <div className="flex items-center justify-between mb-4">
            {currentStep > 0 && (
              <Button variant="ghost" onClick={handlePrevious} className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            )}
            <div className="flex items-center gap-2 ml-auto">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index <= currentStep ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Icon className="w-8 h-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">{currentStepData.title}</CardTitle>
          <CardDescription className="text-lg">{currentStepData.description}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {currentStep === 0 && (
            <div className="space-y-4">
              <div className="text-center space-y-4">
                <div className="flex flex-wrap justify-center gap-2">
                  <Badge variant="secondary">OpenAI GPT</Badge>
                  <Badge variant="secondary">Google Gemini</Badge>
                  <Badge variant="secondary">Anthropic</Badge>
                  <Badge variant="secondary">OpenRouter</Badge>
                </div>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <p className="text-muted-foreground">
                  Choose which AI providers you'd like to use. You can always add more later in settings.
                </p>
              </div>
              <div className="space-y-3">
                {providers.map((provider) => (
                  <div
                    key={provider.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedProviders.includes(provider.id)
                        ? 'border-primary bg-primary/5'
                        : 'hover:border-muted-foreground/50'
                    } ${provider.required ? 'opacity-75' : ''}`}
                    onClick={() => toggleProvider(provider.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{provider.name}</h3>
                          {provider.required && (
                            <Badge variant="secondary" className="text-xs">Required</Badge>
                          )}
                          {selectedProviders.includes(provider.id) && (
                            <CheckCircle className="w-4 h-4 text-primary" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {provider.description}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {provider.models.map((model) => (
                            <Badge key={model} variant="outline" className="text-xs">
                              {model}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Note:</strong> Google Gemini is required for generating conversation titles. 
                  You can use other providers for your main conversations.
                </p>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="text-center space-y-4">
              <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                <p className="text-green-800 dark:text-green-200 font-medium">
                  Setup Complete!
                </p>
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                  You're all set to start chatting with AI
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center pt-4">
            {currentStep < 3 ? (
              <Button onClick={handleNext} className="ml-auto flex items-center gap-2">
                {currentStep === 2 ? 'Continue' : 'Next'}
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button asChild className="ml-auto">
                <a href="/chat">Start Chatting</a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 