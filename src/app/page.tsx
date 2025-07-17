
"use client";

import Header from '@/components/agrimedic/Header';
import Footer from '@/components/agrimedic/Footer';
import DiagnosisTool from '@/components/agrimedic/DiagnosisTool';
import { useLanguage } from '@/context/LanguageContext';

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 md:py-24">
        <div className="relative z-10 text-center mb-16">
           <h1 className="animate-fade-in-up text-4xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-neutral-600 to-neutral-900 dark:from-neutral-100 dark:to-neutral-400">
             {t('heroTitle')}
           </h1>
           <p className="animate-fade-in-up animate-delay-200 mt-6 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
             {t('heroSubtitle')}
           </p>
        </div>
        <div className="animate-fade-in-up animate-delay-400">
          <DiagnosisTool />
        </div>
      </main>
      <Footer />
    </div>
  );
}
