import apiClient from "@/infrastructure/api/apiClient";

export const roleApi = {
  getRoles: () => apiClient.get("/v1/api/roles"),
  createRole: (data: { name: string; code: string }) => apiClient.post("/v1/api/roles", data),
  deleteRole: (id: string) => apiClient.delete(`/v1/api/roles/${id}`),
};

export const iamApi = {
  getPolicies: () => apiClient.get("/v1/api/iam/policies"),
  attachPolicy: (roleId: string, policyId: string) => 
    apiClient.post("/v1/api/iam/policies/attach", { roleId, policyId }),
  createPolicy: (data: any) => apiClient.post("/v1/api/iam/policies", data),
};
