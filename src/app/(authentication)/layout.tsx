import NavigationBar from '@/features/authentication/components/navigation-bar';
import ProgressProvider from '@/features/authentication/components/progress-provider';
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
        <ProgressProvider>{children}</ProgressProvider>
      </div>
    </div>
  );
}
