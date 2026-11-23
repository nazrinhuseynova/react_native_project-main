// ── Route faylları üçün ekranlar ──
export { ForgotPasswordScreen } from './presentation/screens/ForgotPasswordScreen';
export { LoginScreen } from './presentation/screens/LoginScreen';
export { RegisterScreen } from './presentation/screens/RegisterScreen';
export { ResetPasswordScreen } from './presentation/screens/ResetPasswordScreen';
export { VerifyEmailScreen } from './presentation/screens/VerifyEmailScreen';
export { VerifyOtpScreen } from './presentation/screens/VerifyOtpScreen';


export { AuthProvider } from './application/AuthProvider';
export { createAuthStrategyRegistry } from './application/authStrategyRegistry';
export { useAuth } from './application/hooks/useAuth';
export { useBiometricLogin } from './application/hooks/useBiometricLogin';


export { normalizeEmail } from './domain/entities/AuthUser';
export type { AuthUser } from './domain/entities/AuthUser';
export type { Device } from './domain/entities/Device';
export type { Session } from './domain/entities/Session';
export type {
  AuthRepository,
  AuthStateEvent,
  OtpPurpose,
  SignOutScope,
} from './domain/repositories/AuthRepository';
export type { DeviceRepository } from './domain/repositories/DeviceRepository';
export type {
  AuthStrategy,
  AuthStrategyKind,
  BiometricAuthStrategy,
  SignInCredentials,
} from './domain/strategies/AuthStrategy';


export { LoginAttemptPolicy } from './domain/policies/LoginAttemptPolicy';
export { OtpPolicy } from './domain/policies/OtpPolicy';
export { PasswordPolicy } from './domain/policies/PasswordPolicy';
export { PasswordStrengthPolicy } from './domain/policies/PasswordStrength';
export { RequestPasswordReset } from './domain/usecases/RequestPasswordReset';
export { ResendVerification } from './domain/usecases/ResendVerification';
export { ResetPassword } from './domain/usecases/ResetPassword';
export { RestoreSession } from './domain/usecases/RestoreSession';
export { SignIn } from './domain/usecases/SignIn';
export { SignOut } from './domain/usecases/SignOut';
export { SignOutAllDevices } from './domain/usecases/SignOutAllDevices';
export { SignUp } from './domain/usecases/SignUp';
export { VerifyOtp } from './domain/usecases/VerifyOtp';
export { BiometricCredentialStore } from './data/BiometricCredentialStore';
export { SupabaseAuthRepository } from './data/SupabaseAuthRepository';
export { SupabaseDeviceRepository } from './data/SupabaseDeviceRepository';
export { BiometricStrategy } from './data/strategies/BiometricStrategy';
export { EmailOtpStrategy } from './data/strategies/EmailOtpStrategy';
export { EmailPasswordStrategy } from './data/strategies/EmailPasswordStrategy';
export { GoogleOAuthStrategy } from './data/strategies/GoogleOAuthStrategy';
export { toAuthError } from './data/mappers/sessionMapper';