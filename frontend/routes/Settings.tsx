import React, { useState } from 'react';
import { Link } from 'react-router';
import { 
  ArrowLeftIcon, 
  Key, 
  Shield, 
  Trash2,
} from 'lucide-react';
import { Button, buttonVariants } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useAPIKeyStore } from '../stores/APIKeyStore';
import APIKeyForm from '@/frontend/components/APIKeyForm';
import ThemeToggler from '@/frontend/components/ui/ThemeToggler';
import { getModelConfig } from '@/lib/models';

type SettingsTab = 'api-keys' | 'privacy'

export default function Settings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('api-keys');

  const tabs = [
    { id: 'api-keys' as const, label: 'API Keys', icon: Key },
    { id: 'privacy' as const, label: 'Privacy & Data', icon: Shield },
  ];

  const handleClearAllData = () => {
    if (confirm('Are you sure you want to clear all data? This will remove all API keys and chat history.')) {
      localStorage.clear();
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/chat"
                className={buttonVariants({
                  variant: 'ghost',
                  size: 'sm',
                  className: 'gap-2',
                })}
              >
                <ArrowLeftIcon className="w-4 h-4" />
                Back to Chat
              </Link>
              <div>
                <h1 className="text-2xl font-bold">Settings</h1>
                <p className="text-sm text-muted-foreground">Manage your AI assistant preferences</p>
              </div>
            </div>
            <ThemeToggler />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="lg:w-64 flex-shrink-0">
            <div className="sticky top-24">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <nav>
                    {tabs.map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-all text-left font-medium ${
                            activeTab === tab.id
                              ? 'bg-primary text-primary-foreground shadow-sm'
                              : 'hover:bg-muted hover:shadow-sm'
                          }`}
                        >
                          <Icon className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{tab.label}</span>
                        </button>
                      );
                    })}
                  </nav>
                </CardContent>
              </Card>
            </div>
          </aside>

          <main className="flex-1 min-w-0">
            <div className="space-y-6">
            {activeTab === 'api-keys' && (
              <div className="space-y-6">
                <APIKeyForm />
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="space-y-6">

                <div className="w-full max-w-2xl mx-auto space-y-6">
                  <div className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-2">
                      <Shield className="h-6 w-6 text-primary" />
                      <h2 className="text-2xl font-bold">Privacy & Data</h2>
                    </div>
                    
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="p-1.5 bg-primary/10 rounded-full">
                          <Shield className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-sm font-medium">
                            Local Storage Only
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Your data never leaves your device. Everything is stored locally in your browser.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 p-4 border rounded-lg bg-background/50 hover:bg-background/80 transition-colors">
                    <div className="flex items-center gap-2">
                      <Trash2 className="w-4 h-4 text-destructive" />
                      <h3 className="text-sm font-medium text-destructive">
                        Clear All Data
                      </h3>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      This will permanently delete all your API keys, chat history, and settings. This action cannot be undone.
                    </p>

                    <Button variant="destructive" onClick={handleClearAllData} className="w-full">
                      Clear All Data
                    </Button>
                  </div>
                </div>
              </div>
            )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
