
"use client";

import Header from '@/components/agrimedic/Header';
import Footer from '@/components/agrimedic/Footer';
import DiagnosisTool from '@/components/agrimedic/DiagnosisTool';
import { useLanguage } from '@/context/LanguageContext';

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="relative z-10">
          <div className="h-[40vh] md:h-[50vh] flex items-center justify-center text-center bg-gradient-to-b from-primary/80 to-background rounded-b-3xl mb-12 -mt-[68px]">
            <div>
              <h1 className="text-4xl md:text-6xl font-extrabold text-primary-foreground tracking-tight">
                {t('heroTitle')}
              </h1>
              <p className="mt-4 text-lg md:text-xl text-primary-foreground/90 max-w-2xl mx-auto">
                {t('heroSubtitle')}
              </p>
            </div>
          </div>
          <DiagnosisTool />
        </div>
      </main>
      <Footer />
    </div>
  );
}
