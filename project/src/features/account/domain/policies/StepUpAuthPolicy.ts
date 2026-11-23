export type SensitiveAction = 'change_password' | 'change_email' | 'delete_account';

export type StepUpMethod = 'password' | 'none';

const TTL_SECONDS: Record<SensitiveAction, number> = {
  change_password: 300,
  change_email: 300,
  delete_account: 60,
};


export class StepUpAuthPolicy {
 
  methodFor(provider: string): StepUpMethod {
    return provider === 'email' ? 'password' : 'none';
  }

  requiresStepUp(
    action: SensitiveAction,
    provider: string,
    verifiedAt: number | null,
    now: number,
  ): boolean {
    if (this.methodFor(provider) === 'none') return false;
    if (verifiedAt === null) return true;
    return now - verifiedAt > TTL_SECONDS[action] * 1000;
  }
}