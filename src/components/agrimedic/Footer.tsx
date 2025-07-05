
"use client";

import * as React from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  const [year, setYear] = React.useState(new Date().getFullYear());
  
  React.useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-secondary text-secondary-foreground py-6 mt-auto border-t">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm">{t('footerCopyright').replace('{year}', year.toString())}</p>
        <p className="text-xs mt-1">{t('footerTagline')}</p>
      </div>
    </footer>
  );
}
