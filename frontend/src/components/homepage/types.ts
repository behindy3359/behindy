import React from "react";

export interface StatCardProps {
  stat: {
    icon: React.ComponentType<{ size?: number }>;
    title: string;
    value: string;
    change: string;
  };
  index: number;
}