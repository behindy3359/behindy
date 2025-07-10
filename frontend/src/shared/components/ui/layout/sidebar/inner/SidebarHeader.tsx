import React from 'react';
import { ArrowLeft, Menu } from 'lucide-react';
import { HeaderSection, BrandLogo, ToggleButton } from '../styles';

interface SidebarHeaderProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({ 
  isOpen, 
  onToggle 
}) => {
  return (
    <HeaderSection $isOpen={isOpen}>
      <BrandLogo $isOpen={isOpen}>
        <div className="logo">B</div>
        <div className="brand-name">Behindy</div>
      </BrandLogo>
      
      <ToggleButton onClick={onToggle}>
        {isOpen ? <ArrowLeft size={20} /> : <Menu size={20} />}
      </ToggleButton>
    </HeaderSection>
  );
};