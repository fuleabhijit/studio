
"use client";

import Header from '@/components/agrimedic/Header';
import Footer from '@/components/agrimedic/Footer';
import DiagnosisTool from '@/components/agrimedic/DiagnosisTool';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { ArrowDown, Leaf, LineChart, MessagesSquare, Users,ChevronDown } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent } from '@/components/ui/card';

const FeatureCard = ({ icon, title, description }: { icon: React.ElementType, title: string, description: string }) => {
  const Icon = icon;
  return (
    <Card className="glass-card text-center p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
      <div className="mb-4 inline-block p-4 bg-accent/20 rounded-full">
        <Icon className="w-10 h-10 text-accent" />
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </Card>
  );
};

const TestimonialCard = ({ quote, name, location }: { quote: string, name: string, location: string }) => (
    <Card className="glass-card p-6 h-full flex flex-col">
        <p className="text-muted-foreground flex-grow">"{quote}"</p>
        <div className="mt-4">
            <p className="font-bold">{name}</p>
            <p className="text-sm text-primary">{location}</p>
        </div>
    </Card>
);


export default function Home() {
  const { t } = useLanguage();

  const handleScroll = () => {
    const toolSection = document.getElementById('diagnosis-tool');
    if (toolSection) {
      toolSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4">
        {/* Hero Section */}
        <section className="text-center py-24 md:py-32">
           <h1 className="animate-fade-in-up text-4xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-neutral-600 to-neutral-900 dark:from-neutral-100 dark:to-neutral-400">
             {t('heroTitle')}
           </h1>
           <p className="animate-fade-in-up animate-delay-200 mt-6 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
             {t('heroSubtitle')}
           </p>
           <div className="animate-fade-in-up animate-delay-400 mt-10">
                <Button size="lg" className="text-lg py-7 px-8 bg-accent text-accent-foreground hover:bg-accent/90 transform hover:scale-105 transition-all duration-300" onClick={handleScroll}>
                    Get Started <ArrowDown className="ml-2 h-5 w-5"/>
                </Button>
           </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">How It Works</h2>
            <p className="text-muted-foreground mt-2">Get your diagnosis in 3 simple steps.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="animate-fade-in-up">
              <div className="mb-4 inline-block p-5 bg-primary/10 rounded-full text-primary">
                <span className="text-3xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Snap a Photo</h3>
              <p className="text-muted-foreground">Take a clear picture of the affected part of your plant or crop.</p>
            </div>
            <div className="animate-fade-in-up animate-delay-200">
              <div className="mb-4 inline-block p-5 bg-primary/10 rounded-full text-primary">
                <span className="text-3xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Upload & Analyze</h3>
              <p className="text-muted-foreground">Upload the image to our platform and let our AI analyze it.</p>
            </div>
            <div className="animate-fade-in-up animate-delay-400">
              <div className="mb-4 inline-block p-5 bg-primary/10 rounded-full text-primary">
                <span className="text-3xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Get Instant Solutions</h3>
              <p className="text-muted-foreground">Receive a diagnosis, treatment options, and market insights in seconds.</p>
            </div>
          </div>
        </section>

        {/* Diagnosis Tool Section */}
        <section id="diagnosis-tool" className="py-16">
          <div className="animate-fade-in-up">
            <DiagnosisTool />
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
           <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold">More Than Just Diagnosis</h2>
              <p className="text-muted-foreground mt-2">A complete toolkit for the modern farmer.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
                <FeatureCard icon={Leaf} title="Instant AI Diagnosis" description="Accurate pest and disease identification from a single photo."/>
                <FeatureCard icon={LineChart} title="Live Market Prices" description="Get real-time mandi prices for your crops to maximize profits."/>
                <FeatureCard icon={MessagesSquare} title="Expert Q&A" description="Ask any farming question and get instant answers from our AI expert."/>
            </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold">Trusted by Farmers</h2>
                <p className="text-muted-foreground mt-2">See what our users are saying about AgriMedic AI.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
                <TestimonialCard 
                    quote="This app saved my tomato crop! The diagnosis was fast and the remedies were easy to follow. A must-have for every farmer."
                    name="Rajesh Kumar"
                    location="Maharashtra"
                />
                <TestimonialCard 
                    quote="The market price feature is a game-changer. I know exactly when to sell my produce for the best price. Highly recommended!"
                    name="Priya Singh"
                    location="Punjab"
                />
                <TestimonialCard 
                    quote="I used the Q&A section to ask about soil health, and the answer was so detailed and helpful. It's like having an expert in my pocket."
                    name="Anil Gowda"
                    location="Karnataka"
                />
            </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
           <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold">Frequently Asked Questions</h2>
            </div>
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-lg">Is the AI diagnosis accurate?</AccordionTrigger>
                  <AccordionContent className="text-base text-muted-foreground">
                    Our AI is trained on a massive dataset of plant images and is highly accurate. However, for critical cases, we always recommend confirming with a local agricultural expert. Our escalation feature can help you with that!
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-lg">Are the market prices real-time?</AccordionTrigger>
                  <AccordionContent className="text-base text-muted-foreground">
                    Yes, we use live data from government APIs to provide you with the most up-to-date mandi prices available for various crops across India.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-lg">What languages does the app support?</AccordionTrigger>
                  <AccordionContent className="text-base text-muted-foreground">
                    We've now expanded our language support! The app is available in English and several regional Indian languages, including Hindi, Marathi, Tamil, and more. You can switch languages at any time using the selector in the header.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
        </section>

        {/* Final CTA Section */}
        <section className="text-center py-24">
            <h2 className="text-3xl md:text-4xl font-bold">Ready to Boost Your Farm's Health?</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">Take control of your crop health today. Get an instant diagnosis and expert advice right now.</p>
            <div className="mt-8">
                <Button size="lg" className="text-lg py-7 px-8 bg-accent text-accent-foreground hover:bg-accent/90 transform hover:scale-105 transition-all duration-300" onClick={handleScroll}>
                    Start Diagnosing Now <Leaf className="ml-2 h-5 w-5" />
                </Button>
            </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}

    