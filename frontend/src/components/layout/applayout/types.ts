import React from "react";

export interface AppLayoutProps {
  children: React.ReactNode;
  className?: string;
  layoutType?: 'header' | 'sidebar';
}