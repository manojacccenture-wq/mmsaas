// store/api/axiosBaseQuery.ts

import apiClient from "@/infrastructure/api/apiClient";

export const axiosBaseQuery =
  () =>
  async ({ url, method, data, params }: any) => {
    try {
      const result = await apiClient({
        url,
        method,
        data,
        params,
      });

      return { data: result.data };
    } catch (error: any) {
      return {
        error: {
          status: error.response?.status,
          data: error.response?.data,
        },
      };
    }
  };