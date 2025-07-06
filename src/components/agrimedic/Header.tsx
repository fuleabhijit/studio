
"use client";

import { Leaf, Globe, NotebookText } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Header() {
  const { t, setLanguage, language } = useLanguage();

  return (
    <header className="bg-primary text-primary-foreground shadow-md border-b border-primary/20">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <Leaf className="h-8 w-8 text-primary-foreground" />
            <h1 className="text-2xl lg:text-3xl font-bold font-headline">{t('appTitle')}</h1>
          </Link>
        </div>
        <div className="flex items-center gap-2">
            <Link href="/schemes" passHref>
                <Button variant="ghost" className="rounded-full hidden md:flex" size="icon" title={t('schemesNavTitle')}>
                    <NotebookText className="h-6 w-6" />
                    <span className="sr-only">{t('schemesNavTitle')}</span>
                </Button>
            </Link>
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="rounded-full" size="icon">
                <Globe className="h-6 w-6" />
                <span className="sr-only">{t('language')}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLanguage('en')} disabled={language === 'en'}>
                {t('english')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('hi')} disabled={language === 'hi'}>
                {t('hindi')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('mr')} disabled={language === 'mr'}>
                {t('marathi')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('te')} disabled={language === 'te'}>
                {t('telugu')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('bn')} disabled={language === 'bn'}>
                {t('bengali')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('ta')} disabled={language === 'ta'}>
                {t('tamil')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('gu')} disabled={language === 'gu'}>
                {t('gujarati')}
                </DropdownMenuItem>
            </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
