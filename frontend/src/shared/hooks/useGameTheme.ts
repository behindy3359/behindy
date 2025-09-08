import { useTheme } from './useTheme';
import { gameTheme } from '../styles/gameTheme';

export const useGameTheme = () => {
  const { theme, isGameMode } = useTheme();
  
  return {
    currentTheme: isGameMode ? gameTheme.dark : gameTheme.light,
    isGameMode,
    gameColors: gameTheme.dark.colors.game,
  };
};