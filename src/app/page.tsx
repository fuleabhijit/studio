
"use client";

import Header from '@/components/agrimedic/Header';
import Footer from '@/components/agrimedic/Footer';
import DiagnosisTool from '@/components/agrimedic/DiagnosisTool';
import { useLanguage } from '@/context/LanguageContext';

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen bg-background bg-grid-black/[0.05] dark:bg-grid-white/[0.05]">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="relative z-10 text-center mb-12">
           <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-neutral-600 to-neutral-900 dark:from-neutral-200 dark:to-neutral-500">
             {t('heroTitle')}
           </h1>
           <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
             {t('heroSubtitle')}
           </p>
        </div>
        <DiagnosisTool />
      </main>
      <Footer />
    </div>
  );
}

    