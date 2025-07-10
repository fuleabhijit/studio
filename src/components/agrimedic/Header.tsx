
"use client";

import { Globe, NotebookText, TrendingUp, Menu, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import * as React from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function Header() {
  const { t } = useLanguage();
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: "/prices", icon: TrendingUp, label: t('pricesNavTitle') },
    { href: "/schemes", icon: NotebookText, label: t('schemesNavTitle') },
  ];

  return (
    <header className={cn(
        "sticky top-0 z-50 transition-all duration-300 bg-secondary text-secondary-foreground shadow-sm border-b border-secondary/20"
    )}>
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <h1 className="text-2xl lg:text-3xl font-bold font-headline">AgriMedic AI</h1>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => (
            <Button asChild key={link.href} variant={pathname === link.href ? "default" : "ghost"}>
              <Link href={link.href} className="flex items-center gap-2">
                <link.icon className="h-5 w-5" />
                <span>{link.label}</span>
              </Link>
            </Button>
          ))}
          <LanguageDropdown />
        </nav>
        
        {/* Mobile Navigation */}
        <div className="md:hidden">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[280px] sm:w-[320px] bg-background text-foreground p-0">
                  <div className="flex h-full flex-col">
                    <div className="p-6 border-b">
                       <Link href="/" className="flex items-center gap-3" onClick={() => setIsSheetOpen(false)}>
                          <h1 className="text-2xl font-bold font-headline text-foreground">AgriMedic AI</h1>
                        </Link>
                    </div>
                    <nav className="flex-grow p-4 space-y-2">
                      {navLinks.map((link) => (
                        <SheetClose asChild key={link.href}>
                           <Link
                              href={link.href}
                              className={cn(
                                "flex items-center gap-4 rounded-lg p-3 text-lg font-medium transition-colors hover:bg-muted",
                                pathname === link.href ? "bg-muted text-primary" : ""
                              )}
                            >
                              <link.icon className="h-6 w-6" />
                              {link.label}
                           </Link>
                        </SheetClose>
                      ))}
                    </nav>
                    <div className="p-4 border-t mt-auto">
                        <h3 className="mb-4 text-center text-lg font-semibold">{t('language')}</h3>
                        <div className="grid grid-cols-2 gap-2">
                            <LanguageButton lang="en" label={t('english')} />
                            <LanguageButton lang="hi" label={t('hindi')} />
                            <LanguageButton lang="mr" label={t('marathi')} />
                            <LanguageButton lang="bn" label={t('bengali')} />
                            <LanguageButton lang="gu" label={t('gujarati')} />
                            <LanguageButton lang="ta" label={t('tamil')} />
                            <LanguageButton lang="te" label={t('telugu')} />
                            <LanguageButton lang="kn" label={t('kannada')} />
                            <LanguageButton lang="ml" label={t('malayalam')} />
                        </div>
                    </div>
                  </div>
                </SheetContent>
            </Sheet>
        </div>
      </div>
    </header>
  );
}

function LanguageDropdown() {
  const { t, setLanguage, language } = useLanguage();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 rounded-full px-3" title={t('language')}>
          <Globe className="h-5 w-5" />
          <span className="uppercase text-sm font-semibold">{language}</span>
          <ChevronDown className="h-4 w-4 opacity-70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setLanguage('en')} disabled={language === 'en'}> {t('english')} </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setLanguage('hi')} disabled={language === 'hi'}> {t('hindi')} </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setLanguage('mr')} disabled={language === 'mr'}> {t('marathi')} </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setLanguage('bn')} disabled={language === 'bn'}> {t('bengali')} </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setLanguage('gu')} disabled={language === 'gu'}> {t('gujarati')} </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setLanguage('ta')} disabled={language === 'ta'}> {t('tamil')} </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setLanguage('te')} disabled={language === 'te'}> {t('telugu')} </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setLanguage('kn')} disabled={language === 'kn'}> {t('kannada')} </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setLanguage('ml')} disabled={language === 'ml'}> {t('malayalam')} </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function LanguageButton({ lang, label }: { lang: 'en' | 'hi' | 'mr' | 'te' | 'bn' | 'ta' | 'gu' | 'kn' | 'ml', label: string }) {
    const { setLanguage, language } = useLanguage();
    return (
        <Button onClick={() => setLanguage(lang)} variant={language === lang ? 'default' : 'outline'} className="w-full justify-center">
            {label}
        </Button>
    );
}
