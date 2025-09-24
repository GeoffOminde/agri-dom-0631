import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AppSettings {
  darkMode: boolean;
  locale: string;
  farm?: {
    lat: number;
    lng: number;
  };
  market?: {
    crop: string;
    location: string;
  };
}

interface AppSettingsContextType {
  settings: AppSettings;
  updateSetting: (key: string, value: any) => void;
  updateNestedSetting: (section: string, key: string, value: any) => void;
}

const defaultSettings: AppSettings = {
  darkMode: false,
  locale: 'en-GB',
  farm: { lat: -1.286389, lng: 36.817223 }, // Nairobi default
  market: { crop: 'Maize', location: 'Nairobi' },
};

const AppSettingsContext = createContext<AppSettingsContextType>({
  settings: defaultSettings,
  updateSetting: () => {},
  updateNestedSetting: () => {},
});

export const useAppSettings = () => useContext(AppSettingsContext);

interface AppSettingsProviderProps {
  children: ReactNode;
}

export const AppSettingsProvider: React.FC<AppSettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);

  const updateSetting = (key: string, value: any) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [key]: value,
    }));
  };

  const updateNestedSetting = (section: string, key: string, value: any) => {
    setSettings((prevSettings) => {
      // Create a copy of the current settings
      const updatedSettings = { ...prevSettings };
      
      // Ensure the nested section exists then update it
      const sectionData = (updatedSettings as any)[section] as Record<string, any> | undefined;
      updatedSettings[section as keyof AppSettings] = {
        ...(sectionData || {}),
        [key]: value,
      } as any;
      
      return updatedSettings;
    });
  };

  return (
    <AppSettingsContext.Provider value={{ settings, updateSetting, updateNestedSetting }}>
      {children}
    </AppSettingsContext.Provider>
  );
};
