"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { ThemeProvider } from '@/shared/providers/ThemeProvider';
import { QueryProvider } from '@/shared/providers/QueryProvider';
import { AuthGuard } from '@/features/auth/components/AuthGuard/AuthGuard';
import { requiresAuth } from '@/shared/utils/navigation/navigationUtils';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const pathname = usePathname() ?? '/';
  const needsProtection = React.useMemo(() => requiresAuth(pathname), [pathname]);

  const content = needsProtection ? (
    <AuthGuard>
      {children}
    </AuthGuard>
  ) : (
    <>{children}</>
  );

  return (
    <QueryProvider>
      <ThemeProvider>
        {content}
      </ThemeProvider>
    </QueryProvider>
  );
};

export default AppShell;
