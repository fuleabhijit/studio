
import { Leaf } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-primary text-primary-foreground shadow-lg">
      <div className="container mx-auto px-4 py-4 flex items-center">
        <Leaf className="h-8 w-8 mr-3 text-primary-foreground" />
        <h1 className="text-2xl lg:text-3xl font-bold font-headline">AgriMedic AI</h1>
      </div>
    </header>
  );
}
