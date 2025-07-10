import { useState, useCallback } from 'react';

export interface UsePostFormPreviewReturn {
  isPreview: boolean;
  togglePreview: () => void;
  setPreview: (preview: boolean) => void;
}

export const usePostFormPreview = (): UsePostFormPreviewReturn => {
  const [isPreview, setIsPreview] = useState(false);

  const togglePreview = useCallback(() => {
    setIsPreview(prev => !prev);
  }, []);

  const setPreview = useCallback((preview: boolean) => {
    setIsPreview(preview);
  }, []);

  return {
    isPreview,
    togglePreview,
    setPreview,
  };
};