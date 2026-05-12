export interface PlanApiResponse {
  _id: string;
  name: string;
  code: string;
  description: string;
  isActive: boolean;
  price: number;
  billingCycle: 'monthly' | 'yearly' | 'lifetime';
  maxUsers: number;
  maxProducts: number;
  allowedFeatureKeys: string[];
  isTrialPlan: boolean;
  trialDays: number;
  createdAt: string;
  updatedAt: string;
}

export interface PlanUI {
  id: string;
  name: string;
  code: string;
  description: string;
  isActive: boolean;
  price: number;
  billingCycle: string;
  maxUsers: number;
  maxProducts: number;
  isTrialPlan: boolean;
  createdAt: string;
}

