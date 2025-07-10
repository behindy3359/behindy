import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import type { AgreementSectionProps } from '../../types';

export const AgreementSection: React.FC<AgreementSectionProps> = ({
  agreements,
  errors,
  onChange,
  disabled = false,
}) => {
  const handleTermsClick = () => {
    window.open('/terms', '_blank', 'noopener,noreferrer');
  };

  const handlePrivacyClick = () => {
    window.open('/privacy', '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.div
      className="border border-gray-200 rounded-lg p-6 bg-gray-50"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        약관 동의
      </h3>

      <div className="space-y-4">
        {/* 이용약관 동의 */}
        <div>
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="flex items-center h-5">
              <input
                type="checkbox"
                checked={agreements.terms}
                onChange={(e) => onChange('agreeToTerms', e.target.checked)}
                disabled={disabled}
                className={`
                  w-5 h-5 rounded border-2 transition-all duration-200
                  ${agreements.terms 
                    ? 'bg-blue-500 border-blue-500 text-white' 
                    : 'border-gray-300 hover:border-blue-400'
                  }
                  ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  ${errors.agreeToTerms ? 'border-red-500' : ''}
                `}
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-red-500 font-medium">*</span>
                <button
                  type="button"
                  onClick={handleTermsClick}
                  className="text-blue-600 hover:text-blue-800 font-medium underline decoration-dotted underline-offset-2 transition-colors duration-200"
                  disabled={disabled}
                >
                  이용약관
                </button>
                <ExternalLink size={14} className="text-gray-400" />
                <span className="text-gray-700">에 동의합니다</span>
              </div>
              {errors.agreeToTerms && (
                <motion.p
                  className="text-red-500 text-sm mt-1"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.2 }}
                >
                  {errors.agreeToTerms}
                </motion.p>
              )}
            </div>
          </label>
        </div>

        {/* 개인정보처리방침 동의 */}
        <div>
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="flex items-center h-5">
              <input
                type="checkbox"
                checked={agreements.privacy}
                onChange={(e) => onChange('agreeToPrivacy', e.target.checked)}
                disabled={disabled}
                className={`
                  w-5 h-5 rounded border-2 transition-all duration-200
                  ${agreements.privacy 
                    ? 'bg-blue-500 border-blue-500 text-white' 
                    : 'border-gray-300 hover:border-blue-400'
                  }
                  ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  ${errors.agreeToPrivacy ? 'border-red-500' : ''}
                `}
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-red-500 font-medium">*</span>
                <button
                  type="button"
                  onClick={handlePrivacyClick}
                  className="text-blue-600 hover:text-blue-800 font-medium underline decoration-dotted underline-offset-2 transition-colors duration-200"
                  disabled={disabled}
                >
                  개인정보처리방침
                </button>
                <ExternalLink size={14} className="text-gray-400" />
                <span className="text-gray-700">에 동의합니다</span>
              </div>
              {errors.agreeToPrivacy && (
                <motion.p
                  className="text-red-500 text-sm mt-1"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.2 }}
                >
                  {errors.agreeToPrivacy}
                </motion.p>
              )}
            </div>
          </label>
        </div>

        {/* 마케팅 정보 수신 동의 (선택) */}
        <div>
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="flex items-center h-5">
              <input
                type="checkbox"
                checked={agreements.marketing}
                onChange={(e) => onChange('marketingOptIn', e.target.checked)}
                disabled={disabled}
                className={`
                  w-5 h-5 rounded border-2 transition-all duration-200
                  ${agreements.marketing 
                    ? 'bg-blue-500 border-blue-500 text-white' 
                    : 'border-gray-300 hover:border-blue-400'
                  }
                  ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
              />
            </div>
            <div className="flex-1">
              <div className="text-gray-700">
                마케팅 정보 수신에 동의합니다 
                <span className="text-gray-500 ml-1">(선택)</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                새로운 게임 업데이트와 이벤트 소식을 받아보세요
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* 필수 동의 안내 */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          <span className="text-red-500">*</span> 표시된 항목은 필수 동의 사항입니다.
        </p>
      </div>
    </motion.div>
  );
};