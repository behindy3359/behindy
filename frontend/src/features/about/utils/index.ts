import { AboutNavigationItem, AboutPageSlug, TreeItem } from '../types';

export const aboutPages: AboutNavigationItem[] = [
  {
    slug: 'overview',
    label: '프로젝트 소개',
    path: '/about/overview',
  },
  {
    slug: 'backend',
    label: '백엔드',
    path: '/about/backend',
  },
  {
    slug: 'frontend',
    label: '프론트엔드',
    path: '/about/frontend',
  },
  {
    slug: 'aiserver',
    label: 'AI 서버',
    path: '/about/aiserver',
  },
  {
    slug: 'devops',
    label: 'DevOps',
    path: '/about/devops',
  },
  {
    slug: 'development',
    label: '개발 과정',
    path: '/about/development',
  },
];

export const getAboutPageBySlug = (slug: string): AboutNavigationItem | undefined => {
  return aboutPages.find((page) => page.slug === slug);
};

export const isValidAboutSlug = (slug: string): slug is AboutPageSlug => {
  return aboutPages.some((page) => page.slug === slug);
};

// ProjectStructureDiagram tree data
export const projectStructureTree: TreeItem[] = [
  {
    name: 'feature/',
    type: 'folder',
    badge: 'Feature-based',
    children: [
      {
        name: 'components/',
        type: 'folder',
        comment: '해당 기능의 컴포넌트',
        children: [
          {
            name: 'ComponentA/',
            type: 'folder',
            children: [
              { name: 'index.tsx', type: 'file' },
              { name: 'styles.ts', type: 'file', comment: 'Styled-Components' },
              { name: 'types.ts', type: 'file', isLast: true }
            ]
          },
          {
            name: 'ComponentB/',
            type: 'folder',
            isLast: true
          }
        ]
      },
      {
        name: 'hooks/',
        type: 'folder',
        comment: '커스텀 훅',
        children: [
          { name: 'useFeatureData.ts', type: 'file' },
          { name: 'useFeatureLogic.ts', type: 'file', isLast: true }
        ]
      },
      {
        name: 'types/',
        type: 'folder',
        comment: '타입 정의',
        children: [
          { name: 'index.ts', type: 'file', isLast: true }
        ]
      },
      {
        name: 'utils/',
        type: 'folder',
        comment: '유틸리티 함수',
        children: [
          { name: 'helpers.ts', type: 'file', isLast: true }
        ]
      },
      {
        name: 'stores/',
        type: 'folder',
        comment: 'Zustand 스토어 (필요시)',
        children: [
          { name: 'featureStore.ts', type: 'file', isLast: true }
        ],
        isLast: true
      }
    ]
  }
];
