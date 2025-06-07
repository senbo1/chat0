"use client";

import { useEffect, useState } from "react";
import { X, Share } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import { Card } from "@/frontend/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function isIOS() {
  if (typeof window === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
}

function isInStandaloneMode() {
  if (typeof window === 'undefined') return false;
  return ('standalone' in window.navigator && window.navigator.standalone) ||
         window.matchMedia('(display-mode: standalone)').matches;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOSDevice, setIsIOSDevice] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    // Check if app is already installed
    if (isInStandaloneMode()) {
      setIsInstalled(true);
      return;
    }

    // Check if it's iOS
    if (isIOS()) {
      setIsIOSDevice(true);
      // Check if prompt was recently dismissed
      const dismissedTime = localStorage.getItem("pwa-prompt-dismissed");
      if (dismissedTime) {
        const daysSinceDismissed = (Date.now() - parseInt(dismissedTime)) / (1000 * 60 * 60 * 24);
        if (daysSinceDismissed >= 7) {
          setTimeout(() => setShowPrompt(true), 3000);
        }
      } else {
        setTimeout(() => setShowPrompt(true), 3000);
      }
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show prompt after a delay on mobile
      if (isMobile) {
        setTimeout(() => setShowPrompt(true), 3000);
      }
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, [isMobile]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === "accepted") {
        setShowPrompt(false);
      }
    } catch (error) {
      console.error("Error showing install prompt:", error);
    }
    
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Don't show again for 7 days
    localStorage.setItem("pwa-prompt-dismissed", Date.now().toString());
  };

  if (!showPrompt || isInstalled || !isMobile) {
    return null;
  }

  // iOS-specific prompt
  if (isIOSDevice) {
    return (
      <div className="fixed bottom-4 left-4 right-4 z-50 animate-in slide-in-from-bottom-5">
        <Card className="p-4 shadow-lg">
          <button
            onClick={handleDismiss}
            className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
          
          <div className="pr-8">
            <h3 className="font-semibold mb-2">Install Chat0</h3>
            <p className="text-sm text-muted-foreground mb-3">
              To install this app on your iPhone:
            </p>
            <ol className="text-sm text-muted-foreground space-y-1 mb-3">
              <li className="flex items-center gap-2">
                1. Tap the <Share className="h-4 w-4 inline" /> share button
              </li>
              <li>2. Scroll down and tap "Add to Home Screen"</li>
              <li>3. Tap "Add" in the top right</li>
            </ol>
            
            <Button onClick={handleDismiss} variant="outline" size="sm" className="w-full">
              Got it
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Standard prompt for browsers that support beforeinstallprompt
  if (!deferredPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-in slide-in-from-bottom-5">
      <Card className="p-4 shadow-lg">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
        
        <div className="pr-8">
          <h3 className="font-semibold mb-1">Install Chat0</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Add Chat0 to your home screen for a better experience
          </p>
          
          <div className="flex gap-2">
            <Button onClick={handleInstallClick} size="sm">
              Install
            </Button>
            <Button onClick={handleDismiss} variant="outline" size="sm">
              Not now
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}