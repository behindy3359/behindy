import { AboutNavigationItem, AboutPageSlug } from '../types';

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
