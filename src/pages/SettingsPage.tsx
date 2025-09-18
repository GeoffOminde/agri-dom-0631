import React from 'react';
import i18n from '@/i18n';
import PageLayout from '@/components/layout/PageLayout';
import PageHeader from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAppSettings } from '@/contexts/AppSettingsContext';

const SettingsPage: React.FC = () => {
  const { settings, updateSetting } = useAppSettings();

  return (
    <PageLayout>
      <PageHeader
        title="Settings"
        description="Configure your application preferences"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="darkMode" className="mr-4">Dark mode</Label>
              <Switch
                id="darkMode"
                checked={settings.darkMode}
                onCheckedChange={(checked) => updateSetting('darkMode', checked)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Localization</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="locale" className="mr-4">Locale</Label>
              <select
                id="locale"
                className="h-10 border rounded-md px-3"
                value={settings.locale}
                onChange={(e) => {
                  const nextLocale = e.target.value;
                  updateSetting('locale', nextLocale);
                  // Map full locale to i18n short code
                  const lang = nextLocale.startsWith('sw') ? 'sw' : 'en';
                  void i18n.changeLanguage(lang);
                }}
              >
                <option value="en-GB">English (United Kingdom)</option>
                <option value="sw-KE">Kiswahili (Kenya)</option>
              </select>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default SettingsPage;
