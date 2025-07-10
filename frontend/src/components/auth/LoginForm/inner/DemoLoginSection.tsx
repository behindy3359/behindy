import React from 'react';
import { motion } from 'framer-motion';
import { GamepadIcon } from 'lucide-react';
import { Button } from '@/components/ui/button/Button';
import type { DemoLoginSectionProps } from '../../types';

export const DemoLoginSection: React.FC<DemoLoginSectionProps> = ({
  onDemoLogin,
  disabled = false,
}) => {
  return (
    <motion.div
      className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center">
          <GamepadIcon size={20} className="text-blue-600" />
        <Button
          variant="ghost"
          size="sm"
          onClick={onDemoLogin}
          disabled={disabled}
          className="w-full text-blue-700 border-blue-300 hover:bg-blue-100"
        >
          🎮 데모 계정으로 접속하기
        </Button>
      </div>
    </motion.div>
  );
};