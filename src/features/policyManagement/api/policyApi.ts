import apiClient from "@/infrastructure/api/apiClient";

export const iamApi = {
  getPolicies: () => apiClient.get("/v1/api/iam/policies"),
  attachPolicy: (roleId: string, policyId: string) => 
    apiClient.post("/v1/api/iam/policies/attach", { roleId, policyId }),
  createPolicy: (data: any) => apiClient.post("/v1/api/iam/policies", data),
};