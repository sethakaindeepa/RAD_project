
import api from "./api";

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
};

export const login = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const res = await api.post("/auth/login", {
    email,
    password,
  });

  return res.data;
};

export const register = async (
  name: string,
  email: string,
  password: string
) => {
  const res = await api.post("/auth/register", {
    name,
    email,
    password,
  });

  return res.data;
};

export const getMyDetails = async () => {
  const res = await api.get("/auth/me");
  return res.data;
};

export const refreshTokenCall = async (
  refreshToken: string
) => {
  const res = await api.post("/auth/refresh", {
    refreshToken,
  });

  return res.data;
};
