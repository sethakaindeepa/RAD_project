const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const PUBLIC_ENDPOINTS = [
  "/auth/login",
  "/auth/register",
  "/auth/refresh",
];

let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const refreshToken = localStorage.getItem("refreshToken");

  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(
      responseData?.message || "Token refresh failed"
    );
  }

  const data = responseData.data ?? responseData;

  const newAccessToken =
    data.accessToken ?? data.access_token;

  const newRefreshToken =
    data.refreshToken ?? data.refresh_token;

  if (!newAccessToken) {
    throw new Error("Access token missing in refresh response");
  }

  localStorage.setItem("accessToken", newAccessToken);

  if (newRefreshToken) {
    localStorage.setItem("refreshToken", newRefreshToken);
  }

  return newAccessToken;
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL.replace(/\/$/, "")}${endpoint}`;

  const headers = new Headers(options.headers);

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const isPublic = PUBLIC_ENDPOINTS.some((path) =>
    endpoint.includes(path)
  );

  const sendRequest = (token?: string) => {
    const requestHeaders = new Headers(headers);

    if (token) {
      requestHeaders.set("Authorization", `Bearer ${token}`);
    }

    return fetch(url, {
      ...options,
      headers: requestHeaders,
    });
  };

  let token = localStorage.getItem("accessToken") || undefined;

  let response = await sendRequest(token);

  // Handle expired access token
  if (response.status === 401 && !isPublic) {
    try {
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
      }

      token = await refreshPromise;

      // Retry original request with new access token
      response = await sendRequest(token);
    } catch (error) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      window.location.href = "/login";

      throw error;
    }
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.message || `Request failed: ${response.status}`
    );
  }

  return data as T;
}