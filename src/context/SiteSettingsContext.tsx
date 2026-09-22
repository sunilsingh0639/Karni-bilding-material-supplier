import { createContext, useContext, useEffect, useState } from 'react';
import type { SiteSettings } from '../types';
import { getSiteSettings, DEFAULT_SETTINGS } from '../services/contentService';

const SiteSettingsContext = createContext<SiteSettings>(DEFAULT_SETTINGS);

export function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    getSiteSettings().then(setSettings).catch(() => {/* keep default */});
  }, []);

  return (
    <SiteSettingsContext.Provider value={settings}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}
