import { type PlanApiResponse, type PlanUI } from "./plan.types";

export const mapPlanToUI = (plan: PlanApiResponse): PlanUI => ({
  id: plan._id,
  name: plan.name,
  code: plan.code,
  description: plan.description,
  isActive: plan.isActive,
  price: plan.price,
  billingCycle: plan.billingCycle,
  maxUsers: plan.maxUsers,
  maxProducts: plan.maxProducts,
  isTrialPlan: plan.isTrialPlan,
  createdAt: plan.createdAt,
});
