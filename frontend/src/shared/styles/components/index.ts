// 컴포넌트 통합 export

import styled from 'styled-components';

// 컨테이너 컴포넌트들
export {
  PageContainer,
  BaseCard,
  SectionContainer,
  SectionHeader,
  GridContainer,
  FormContainer,
  FormSection,
  StateContainer,
  FullWidthContainer,
  CenteredContainer,
  FlexContainer,
  containerSizes
} from './containers';

// 폼 컴포넌트들
export {
  BaseForm,
  FormField,
  FormLabel,
  FormGroup,
  FormActions,
  FormError,
  FormSuccess,
  FormHelperText,
  FormSection as FormSectionComponent,
  FormHeader,
  FormDivider,
  InlineForm,
  CompactForm,
  FormLoadingOverlay
} from './forms';

// 버튼 컴포넌트들
export {
  BaseButton,
  ButtonGroup,
  IconButton,
  FloatingActionButton,
  LoadingButton,
  ToggleButton,
  LinkButton,
  GameButton,
  ButtonContent,
  ButtonSpinner
} from './buttons';

// 입력 컴포넌트들
export {
  BaseInput,
  InputWrapper,
  InputContainer,
  InputIcon,
  BaseTextarea,
  BaseSelect,
  BaseCheckbox,
  BaseRadio,
  InputGroup,
  SearchInput,
  FileInput
} from './inputs';

// 애니메이션 컴포넌트들
export {
  AnimatedContainer,
  Spinner,
  PulseContainer,
  BounceContainer,
  HoverScaleContainer,
  HoverLiftContainer,
  FadeTransition,
  SlideTransition,
  ScaleTransition,
  GlowContainer,
  TypewriterContainer,
  RealtimeIndicator,
  LoadingDots,
  AnimatedProgressBar,
  SkeletonLoader
} from './animations';

// Framer Motion variants
export {
  fadeInUp,
  fadeInDown,
  slideInLeft,
  slideInRight,
  scaleInOut,
  modalVariants,
  overlayVariants,
  listContainerVariants,
  listItemVariants,
  gameTextVariants,
  choiceButtonVariants,
  createStaggerChildren,
  createSlideTransition
} from './animations';

// 누락된 컴포넌트들 추가 export
export {
  ErrorText,
  SuccessText,
  Badge,
  LoadingSpinner,
  Divider
} from '../commonStyles';

// 컴포넌트 생성 헬퍼 함수들
export const createBaseComponent = <T extends Record<string, any>>(
  BaseComponent: any,
  defaultProps: Partial<T>
) => {
  return styled(BaseComponent).attrs(defaultProps)``;
};

// 반응형 유틸리티
export const responsive = {
  mobile: '@media (max-width: 640px)',
  tablet: '@media (max-width: 768px)', 
  desktop: '@media (min-width: 1024px)',
  largeDesktop: '@media (min-width: 1280px)',
} as const;

// 공통 스타일 믹스인들
export const commonMixins = {
  // 중앙 정렬
  centerContent: `
    display: flex;
    align-items: center;
    justify-content: center;
  `,
  
  // 텍스트 ellipsis
  textEllipsis: `
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `,
  
  // 멀티라인 텍스트 ellipsis
  textEllipsisMultiline: (lines: number) => `
    display: -webkit-box;
    -webkit-line-clamp: ${lines};
    -webkit-box-orient: vertical;
    overflow: hidden;
  `,
  
  // 포커스 링
  focusRing: (color = 'rgba(102, 126, 234, 0.1)') => `
    &:focus {
      outline: none;
      box-shadow: 0 0 0 3px ${color};
    }
  `,
  
  // 스크롤바 숨기기
  hideScrollbar: `
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
  `,
  
  // 커스텀 스크롤바
  customScrollbar: (thumbColor = '#cbd5e1', trackColor = '#f1f5f9') => `
    &::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    
    &::-webkit-scrollbar-track {
      background: ${trackColor};
      border-radius: 3px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: ${thumbColor};
      border-radius: 3px;
      
      &:hover {
        background: ${thumbColor}dd;
      }
    }
  `,
  
  // 그림자 효과
  elevation: (level: 1 | 2 | 3 | 4 | 5) => {
    const shadows = {
      1: '0 1px 3px rgba(0, 0, 0, 0.1)',
      2: '0 4px 6px rgba(0, 0, 0, 0.1)',
      3: '0 10px 15px rgba(0, 0, 0, 0.1)',
      4: '0 20px 25px rgba(0, 0, 0, 0.1)',
      5: '0 25px 50px rgba(0, 0, 0, 0.25)',
    };
    return `box-shadow: ${shadows[level]};`;
  },
  
  // 절대 중앙 배치
  absoluteCenter: `
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  `,
  
  // 가상 오버레이
  overlay: (opacity = 0.5, color = '#000000') => `
    position: relative;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: ${color};
      opacity: ${opacity};
      pointer-events: none;
    }
  `,
} as const;