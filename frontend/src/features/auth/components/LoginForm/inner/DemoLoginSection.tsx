import React, { useState } from 'react';
import { UserCog, ChevronDown } from 'lucide-react';
import { Button } from '@/shared/components/ui/button/Button';
import { DemoContainer, DemoContent, DemoAccountList, DemoAccountItem } from '../styles';
import { DEMO_ACCOUNTS } from '../../../constants/demoAccounts';

interface DemoLoginSectionProps {
  onDemoLogin: (email: string, password: string) => void;
  disabled?: boolean;
}

export const DemoLoginSection: React.FC<DemoLoginSectionProps> = ({
  onDemoLogin,
  disabled = false,
}) => {
  const [showAccounts, setShowAccounts] = useState(false);

  const handleAccountSelect = (email: string, password: string) => {
    setShowAccounts(false);
    onDemoLogin(email, password);
  };

  return (
    <DemoContainer
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <DemoContent>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAccounts(!showAccounts)}
          disabled={disabled}
          leftIcon={<UserCog size={20} />}
          rightIcon={<ChevronDown size={16} style={{
            transform: showAccounts ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s'
          }} />}
          style={{
            width: '100%',
            color: '#1e3a8a',
            backgroundColor: 'transparent'
          }}
        >
          데모 계정으로 접속하기
        </Button>

        {showAccounts && (
          <DemoAccountList
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {DEMO_ACCOUNTS.map((account) => (
              <DemoAccountItem
                key={account.id}
                onClick={() => handleAccountSelect(account.email, account.password)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="account-name">{account.name}</div>
                <div className="account-email">{account.email}</div>
              </DemoAccountItem>
            ))}
          </DemoAccountList>
        )}
      </DemoContent>
    </DemoContainer>
  );
};