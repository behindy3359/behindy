"use client";

import React from 'react';
import { AppLayout } from '@/shared/components/layout/applayout/AppLayout';
import { PageContainer } from '@/shared/styles/commonContainers';
import { AboutPageContainer, AboutHeader } from '../styles';

interface AboutLayoutProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export const AboutLayout: React.FC<AboutLayoutProps> = ({
  title,
  description,
  children,
}) => {
  return (
    <AppLayout>
      <PageContainer>
        <AboutPageContainer>
          <AboutHeader>
            <h1 className="page-title">{title}</h1>
            {description && (
              <p className="page-description">{description}</p>
            )}
          </AboutHeader>
          {children}
        </AboutPageContainer>
      </PageContainer>
    </AppLayout>
  );
};
