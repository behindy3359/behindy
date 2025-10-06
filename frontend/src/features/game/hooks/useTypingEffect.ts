import { useState, useEffect, useCallback, useRef } from 'react';

interface UseTypingEffectOptions {
  speed?: number;           // 타이핑 속도 (ms)
  onComplete?: () => void;   // 타이핑 완료 콜백
  enabled?: boolean;         // 타이핑 효과 활성화 여부
}

export function useTypingEffect(
  text: string,
  options: UseTypingEffectOptions = {}
) {
  const {
    speed = 30,
    onComplete,
    enabled = true
  } = options;

  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentIndexRef = useRef(0);

  // 타이핑 중지
  const stopTyping = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsTyping(false);
  }, []);

  // 즉시 완료
  const skipTyping = useCallback(() => {
    stopTyping();
    setDisplayedText(text);
    setIsComplete(true);
    setIsTyping(false);
    onComplete?.();
  }, [text, stopTyping, onComplete]);

  // 타이핑 시작/재시작
  const startTyping = useCallback(() => {
    if (!enabled) {
      setDisplayedText(text);
      setIsComplete(true);
      return;
    }

    stopTyping();
    setDisplayedText('');
    setIsTyping(true);
    setIsComplete(false);
    currentIndexRef.current = 0;
  }, [text, enabled, stopTyping]);

  // 리셋
  const reset = useCallback(() => {
    stopTyping();
    setDisplayedText('');
    setIsComplete(false);
    currentIndexRef.current = 0;
  }, [stopTyping]);

  // 타이핑 효과 구현
  useEffect(() => {
    if (!enabled) {
      setDisplayedText(text);
      setIsComplete(true);
      return;
    }

    if (isTyping && currentIndexRef.current < text.length) {
      timeoutRef.current = setTimeout(() => {
        currentIndexRef.current++;
        setDisplayedText(text.slice(0, currentIndexRef.current));

        if (currentIndexRef.current >= text.length) {
          setIsTyping(false);
          setIsComplete(true);
          onComplete?.();
        }
      }, speed);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [text, displayedText, isTyping, speed, enabled, onComplete]);

  // 텍스트 변경 시 자동 시작
  useEffect(() => {
    startTyping();
  }, [text]); // startTyping은 의존성에서 제외 (무한 루프 방지)

  return {
    displayedText,
    isTyping,
    isComplete,
    skipTyping,
    startTyping,
    reset
  };
}