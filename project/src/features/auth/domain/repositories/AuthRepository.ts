import type { Session } from '../entities/Session';

export type AuthStateEvent =
  | 'initialSession'
  | 'signedIn'
  | 'signedOut'
  | 'tokenRefreshed'
  | 'passwordRecovery'
  | 'userUpdated';

export type AuthStateListener = (event: AuthStateEvent, session: Session | null) => void;

export type SignOutScope = 'local' | 'global';

export type OtpPurpose = 'signup' | 'recovery';

export type VerifyOtpInput = {
  email: string;
  code: string;
  purpose: OtpPurpose;
};

export interface AuthRepository {
  getSession(): Promise<Session | null>;
  onAuthStateChange(listener: AuthStateListener): () => void;
  signOut(scope: SignOutScope): Promise<void>;
  requestPasswordReset(email: string): Promise<void>;
  verifyOtp(input: VerifyOtpInput): Promise<Session>;
  updatePassword(newPassword: string): Promise<void>;
  resendVerification(email: string): Promise<void>;
}