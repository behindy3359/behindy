import styled from 'styled-components';
import { motion } from 'framer-motion';

export const AboutPageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const AboutHeader = styled.div`
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--border-light);

  .page-title {
    font-size: 2.5rem;
    font-weight: 800;
    color: var(--text-primary);
    margin-bottom: 1rem;

    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }

  .page-description {
    font-size: 1.125rem;
    color: var(--text-secondary);
    line-height: 1.6;
  }
`;

export const AboutSection = styled(motion.section)`
  margin-bottom: 3rem;

  .section-title {
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 1.5rem;
    padding-bottom: 0.75rem;
    border-bottom: 2px solid var(--primary-500);
  }

  .section-content {
    font-size: 1rem;
    color: var(--text-secondary);
    line-height: 1.8;

    p {
      margin-bottom: 1rem;
    }

    ul, ol {
      margin-left: 1.5rem;
      margin-bottom: 1rem;
    }

    li {
      margin-bottom: 0.5rem;
    }

    code {
      background: var(--bg-secondary);
      padding: 0.2rem 0.4rem;
      border-radius: 0.25rem;
      font-family: 'Consolas', 'Monaco', monospace;
      font-size: 0.875rem;
    }
  }
`;

export const AboutCard = styled(motion.div)`
  background: var(--bg-primary);
  padding: 2rem;
  border-radius: 1rem;
  border: 1px solid var(--border-light);
  box-shadow: var(--shadow-card);
  margin-bottom: 1.5rem;

  &:hover {
    box-shadow: var(--shadow-lg);
    border-color: var(--primary-500);
  }

  .card-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.75rem;
  }

  .card-content {
    font-size: 1rem;
    color: var(--text-secondary);
    line-height: 1.6;
  }
`;

export const TechStackGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  margin-top: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const TechStackItem = styled.div`
  padding: 0.75rem 1rem;
  background: var(--bg-secondary);
  border-radius: 0.5rem;
  border: 1px solid var(--border-light);
  text-align: center;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--primary-500);
    transform: translateY(-2px);
  }

  .category {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--text-tertiary);
    text-transform: uppercase;
    margin-bottom: 0.25rem;
  }

  .tech {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-secondary);
  }
`;

export const ImagePlaceholder = styled.div`
  width: 100%;
  max-width: 900px;
  margin: 1.5rem auto;
  padding: 2rem;
  background: var(--bg-secondary);
  border-radius: 1rem;
  border: 1px solid var(--border-light);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;

  .placeholder-content {
    text-align: center;
    color: var(--text-tertiary);

    .title {
      font-size: 1rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }

    .description {
      font-size: 0.75rem;
      line-height: 1.6;
    }
  }
`;
