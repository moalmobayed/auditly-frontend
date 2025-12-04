"use client";

import { Platform, Store } from "@/types/compliance";
import { Card, CardContent } from "@/components/ui/card";
import { Smartphone, Apple, Code, Laptop } from "lucide-react";

interface PlatformSelectorProps {
  selectedPlatform: Platform | null;
  selectedStore: Store | null;
  onPlatformChange: (platform: Platform | null) => void;
  onStoreChange: (store: Store | null) => void;
  disabled?: boolean;
}

const platformOptions = [
  {
    value: Platform.Android,
    label: "Android",
    icon: Smartphone,
    stores: [Store.GooglePlay],
  },
  {
    value: Platform.iOS,
    label: "iOS",
    icon: Apple,
    stores: [Store.AppStore],
  },
  {
    value: Platform.ReactNative,
    label: "React Native",
    icon: Code,
    stores: [Store.GooglePlay, Store.AppStore],
  },
  {
    value: Platform.Flutter,
    label: "Flutter",
    icon: Laptop,
    stores: [Store.GooglePlay, Store.AppStore],
  },
];

const storeOptions = [
  { value: Store.GooglePlay, label: "Google Play Store" },
  { value: Store.AppStore, label: "Apple App Store" },
];

export function PlatformSelector({
  selectedPlatform,
  selectedStore,
  onPlatformChange,
  onStoreChange,
  disabled = false,
}: PlatformSelectorProps) {
  const handlePlatformClick = (platform: Platform) => {
    if (disabled) return;
    onPlatformChange(platform === selectedPlatform ? null : platform);

    // Auto-select store if platform only supports one
    const platformOption = platformOptions.find((p) => p.value === platform);
    if (platformOption?.stores.length === 1) {
      onStoreChange(platformOption.stores[0]);
    }
  };

  const availableStores =
    selectedPlatform
      ? platformOptions.find((p) => p.value === selectedPlatform)?.stores || []
      : [];

  return (
    <div className="space-y-4">
      {/* Platform Selection */}
      <div>
        <label className="text-sm font-medium mb-3 block">
          Select Platform
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {platformOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = selectedPlatform === option.value;

            return (
              <Card
                key={option.value}
                className={`cursor-pointer transition-all ${
                  disabled
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:border-primary"
                } ${
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border"
                }`}
                onClick={() => handlePlatformClick(option.value)}
              >
                <CardContent className="p-4 text-center">
                  <Icon
                    className={`h-8 w-8 mx-auto mb-2 ${
                      isSelected ? "text-primary" : "text-muted-foreground"
                    }`}
                  />
                  <div className="text-sm font-medium">{option.label}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Store Selection */}
      {selectedPlatform && availableStores.length > 1 && (
        <div>
          <label className="text-sm font-medium mb-3 block">
            Target App Store
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {storeOptions
              .filter((store) => availableStores.includes(store.value))
              .map((option) => {
                const isSelected = selectedStore === option.value;

                return (
                  <Card
                    key={option.value}
                    className={`cursor-pointer transition-all ${
                      disabled
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:border-primary"
                    } ${
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-border"
                    }`}
                    onClick={() => !disabled && onStoreChange(option.value)}
                  >
                    <CardContent className="p-4">
                      <div className="text-sm font-medium text-center">
                        {option.label}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}

