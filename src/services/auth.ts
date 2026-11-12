import { apiFetch } from "./api";

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
};

type BackendLoginResponse = {
  message: string;
  data: {
    email: string;
    roles: string[];
    access_token: string;
    refresh_token: string;
  };
};

export const login = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const response = await apiFetch<BackendLoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  return {
    accessToken: response.data.access_token,
    refreshToken: response.data.refresh_token,
    user: {
      id: "",
      name: "",
      email: response.data.email,
    },
  };
};

export const register = async (
  name: string,
  email: string,
  password: string
) => {
  return apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });
};

export const getMyDetails = async () => {
  return apiFetch("/auth/me");
};

export const refreshTokenCall = async (
  refreshToken: string
) => {
  const response = await apiFetch<BackendLoginResponse>(
    "/auth/refresh",
    {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    }
  );

  return {
    accessToken: response.data.access_token,
    refreshToken: response.data.refresh_token,
  };
};