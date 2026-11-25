import type { Plan } from '../entities/Plan';

export interface PlanRepository {
  list(): Promise<Plan[]>;
  getById(planId: string): Promise<Plan | null>;
}
