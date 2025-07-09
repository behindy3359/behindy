import React from 'react';
import { ArrowLeft, Edit3, FileText, Eye } from 'lucide-react';
import { getHeaderTitle, getPreviewToggleText } from '../utils';
import { BackButton, Header, HeaderLeft, PreviewToggle, Title, Actions } from '../styles';
import type { PostFormHeaderProps } from '../types';

export const PostFormHeader = React.memo<PostFormHeaderProps>(
  function PostFormHeader({ mode, isPreview, onTogglePreview, onBack }) {
    return (
      <Header>
        <HeaderLeft>
          <BackButton
            onClick={onBack}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ArrowLeft size={16} />
            목록으로
          </BackButton>
          
          <Title>
            {mode === 'create' ? (
              <>
                <Edit3 size={24} />
                {getHeaderTitle(mode)}
              </>
            ) : (
              <>
                <FileText size={24} />
                {getHeaderTitle(mode)}
              </>
            )}
          </Title>
        </HeaderLeft>

        <Actions>
          <PreviewToggle
            $active={isPreview}
            onClick={onTogglePreview}
            type="button"
          >
            <Eye size={16} />
            {getPreviewToggleText(isPreview)}
          </PreviewToggle>
        </Actions>
      </Header>
    );
  }
);