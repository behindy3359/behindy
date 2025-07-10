import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Shield } from 'lucide-react';
import { passwordUtils } from '../../utils/passwordUtils';
import type { PasswordStrengthMeterProps } from '../../types';

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({
  password,
  className = '',
}) => {
  const strength = useMemo(() => 
    passwordUtils.calculateStrength(password), 
    [password]
  );

  const hints = useMemo(() => 
    passwordUtils.generateHints(password), 
    [password]
  );

  if (!password) {
    return null;
  }

  const strengthColor = passwordUtils.getStrengthColor(strength.level);
  const strengthText = passwordUtils.getStrengthText(strength.level);
  const percentage = passwordUtils.getStrengthPercentage(strength.score);

  return (
    <div className={`mt-4 ${className}`}>
      {/* 강도 바 */}
      <div className="mb-3">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            비밀번호 강도
          </span>
          <span 
            className="text-sm font-semibold"
            style={{ color: strengthColor }}
          >
            {strengthText}
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <motion.div
            className="h-full rounded-full transition-all duration-300"
            style={{ backgroundColor: strengthColor }}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* 요구사항 체크리스트 */}
      <div className="p-4 bg-gray-50 rounded-lg border">
        <div className="flex items-center gap-2 mb-3">
          <Shield size={16} className="text-gray-600" />
          <span className="text-sm font-medium text-gray-700">
            비밀번호 요구사항
          </span>
        </div>
        
        <div className="space-y-2">
          {Object.entries(strength.requirements).map(([key, met]) => {
            const labels = {
              length: '8자 이상',
              lowercase: '소문자 포함',
              uppercase: '대문자 포함',
              number: '숫자 포함',
              special: '특수문자 포함',
            };

            return (
              <motion.div
                key={key}
                className={`flex items-center gap-2 text-sm ${
                  met ? 'text-green-600' : 'text-gray-500'
                }`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
              >
                {met ? (
                  <Check size={14} className="text-green-600" />
                ) : (
                  <X size={14} className="text-gray-400" />
                )}
                <span className={met ? 'line-through' : ''}>
                  {labels[key as keyof typeof labels]}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* 힌트 메시지 */}
        {hints.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            {hints.map((hint, index) => (
              <motion.div
                key={index}
                className="text-xs text-gray-600 mb-1"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {hint}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};