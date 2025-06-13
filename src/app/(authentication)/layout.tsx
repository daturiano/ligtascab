import NavigationBar from '@/features/authentication/components/navigation-bar';
import React from 'react';

export default function AuthenticationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <NavigationBar />
      <div className="flex flex-grow items-center justify-center">
        {children}
      </div>
    </div>
  );
}
