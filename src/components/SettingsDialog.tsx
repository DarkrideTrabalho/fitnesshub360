
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Settings as SettingsIcon, Sun, Moon, Monitor, Globe } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { AVAILABLE_LANGUAGES } from '@/lib/types/settings';
import { ScrollArea } from '@/components/ui/scroll-area';

const SettingsDialog = () => {
  const { settings, updateTheme, updateLanguage } = useSettings();
  const [open, setOpen] = React.useState(false);

  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    updateTheme(theme);
  };

  const handleLanguageChange = (language: string) => {
    updateLanguage(language);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <SettingsIcon className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <h3 className="text-sm font-medium leading-none flex items-center gap-2">
              <Sun className="h-4 w-4" /> Theme
            </h3>
            <RadioGroup
              value={settings.theme}
              onValueChange={(value) => handleThemeChange(value as 'light' | 'dark' | 'system')}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="light" id="theme-light" />
                <Label htmlFor="theme-light" className="flex items-center gap-1">
                  <Sun className="h-4 w-4" /> Light
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dark" id="theme-dark" />
                <Label htmlFor="theme-dark" className="flex items-center gap-1">
                  <Moon className="h-4 w-4" /> Dark
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="system" id="theme-system" />
                <Label htmlFor="theme-system" className="flex items-center gap-1">
                  <Monitor className="h-4 w-4" /> System
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-medium leading-none flex items-center gap-2">
              <Globe className="h-4 w-4" /> Language
            </h3>
            <ScrollArea className="h-72">
              <RadioGroup
                value={settings.language}
                onValueChange={handleLanguageChange}
                className="space-y-2"
              >
                {AVAILABLE_LANGUAGES.map((language) => (
                  <div key={language.code} className="flex items-center space-x-2">
                    <RadioGroupItem value={language.code} id={`lang-${language.code}`} />
                    <Label htmlFor={`lang-${language.code}`} className="flex items-center gap-2">
                      <span>{language.flag}</span> {language.name}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
