type QueryArgs = {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  data?: any;
  params?: any;
};

// ✅ GET helper
export const get =
  (url: string) =>
  (params?: any): QueryArgs => ({
    url,
    method: "GET",
    params,
  });

// ✅ POST helper
export const post =
  (url: string) =>
  (data?: any): QueryArgs => ({
    url,
    method: "POST",
    data,
  });

// ✅ PUT helper
export const put =
  (url: string) =>
  (data?: any): QueryArgs => ({
    url,
    method: "PUT",
    data,
  });

// ✅ DELETE helper
export const del =
  (url: string) =>
  (params?: any): QueryArgs => ({
    url,
    method: "DELETE",
    params,
  });