// 스토리 기본 정보
export interface Story {
  storyId: number;
  storyTitle: string;
  estimatedLength: number;
  difficulty: string;
  theme: string;
  description: string;
  stationName: string;
  stationLine: number;
  canPlay: boolean;
  playStatus: string;
}

// 역별 스토리 응답
export interface StationStoriesResponse {
  stories: Story[];
  stationName: string;
  stationLine: number;
  hasActiveGame: boolean;
}

// 스토리 난이도
export type StoryDifficulty = 'easy' | 'medium' | 'hard' | '쉬움' | '보통' | '어려움';