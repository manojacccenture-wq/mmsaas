import { baseApi } from "@/app/store/api/baseApi";
import { get, post } from "@/app/store/api/apiHelpers";

export const demoRequestApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDemoRequests: builder.query({
      query: ({ page = 1, limit = 10 }: { page: number; limit: number }) =>
        get("/v1/api/demo-request")({ page, limit }),
      providesTags: ["DemoRequest" as any],
    }),
    approveDemoRequest: builder.mutation({
      query: (id: string) => post(`/v1/api/demo-request/${id}/approve`)(),
      invalidatesTags: ["DemoRequest" as any],
    }),
    rejectDemoRequest: builder.mutation({
      query: (id: string) => post(`/v1/api/demo-request/${id}/reject`)(),
      invalidatesTags: ["DemoRequest" as any],
    }),
  }),
});

export const {
  useGetDemoRequestsQuery,
  useApproveDemoRequestMutation,
  useRejectDemoRequestMutation,
} = demoRequestApi;
