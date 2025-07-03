"use client";

import * as React from 'react';

export default function Footer() {
  const [year, setYear] = React.useState(new Date().getFullYear());
  
  React.useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-secondary text-secondary-foreground py-6 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm">&copy; {year} AgriMedic AI. All rights reserved.</p>
        <p className="text-xs mt-1">Empowering farmers with AI technology.</p>
      </div>
    </footer>
  );
}
