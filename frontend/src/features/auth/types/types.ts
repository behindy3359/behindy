export interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
  agreeToPrivacy: boolean;
  marketingOptIn: boolean;
}

export interface SignupFormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  agreeToTerms?: string;
  agreeToPrivacy?: string;
  marketingOptIn?: string;
}

export interface PasswordStrength {
  score: number;
  level: 'very-weak' | 'weak' | 'medium' | 'strong' | 'very-strong';
  requirements: {
    length: boolean;
    lowercase: boolean;
    uppercase: boolean;
    number: boolean;
    special: boolean;
  };
  messages: string[];
}

export interface AgreementState {
  terms: boolean;
  privacy: boolean;
  marketing: boolean;
}

export interface FormValidationResult {
  isValid: boolean;
  errors: SignupFormErrors;
}

export interface SignupFormFieldsProps {
  formData: SignupFormData;
  errors: SignupFormErrors;
  onChange: (field: keyof SignupFormData, value: string | boolean) => void;
  onBlur: (field: keyof SignupFormData) => void;
  disabled?: boolean;
}

export interface PasswordStrengthMeterProps {
  password: string;
  className?: string;
}

export interface AgreementSectionProps {
  agreements: AgreementState;
  errors: Pick<SignupFormErrors, 'agreeToTerms' | 'agreeToPrivacy'>;
  onChange: (field: 'agreeToTerms' | 'agreeToPrivacy' | 'marketingOptIn', value: boolean) => void;
  disabled?: boolean;
}

export interface SignupFormActionsProps {
  isLoading: boolean;
  isValid: boolean;
  onCancel?: () => void;
}


export interface LoginFormData {
  email: string;
  password: string;
}

export interface LoginFormErrors {
  email?: string;
  password?: string;
  submit?: string;
}

export interface LoginFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
}

export interface LoginFormFieldsProps {
  formData: LoginFormData;
  errors: LoginFormErrors;
  onChange: (field: keyof LoginFormData, value: string | boolean) => void;
  onBlur: (field: keyof LoginFormData) => void;
  disabled?: boolean;
  showDemoLogin?: boolean;
  onDemoLogin?: () => void;
}

export interface DemoLoginSectionProps {
  onDemoLogin: () => void;
  disabled?: boolean;
}