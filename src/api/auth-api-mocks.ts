import type { LoginData, NumbersAuth } from "../types";

export const authApiMocks = {
  login: async (
    data: LoginData
  ): Promise<{ success: boolean; requires2FA?: boolean }> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (data.email === "invalid@mail.com") {
      throw new Error("Invalid credentials");
    }
    if (data.email === "locked@mail.com") {
      throw new Error("Account temporarily locked");
    }
    if (data.email === "server@mail.com") {
      throw new Error("Internal server error");
    }

    return {
      success: true,
      requires2FA: true,
    };
  },

  verifyNumbers: async (
    data: NumbersAuth
  ): Promise<{ success: boolean; token?: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (data.code === "000000") {
      throw new Error("Invalid code");
    }
    if (data.code === "999999") {
      throw new Error("Code expired");
    }
    if (data.code === "111111") {
      throw new Error("Too many attempts");
    }

    return {
      success: true,
      token: "new-token",
    };
  },

  requestNewNumbers: async (): Promise<{ success: boolean }> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (Math.random() < 0.1) {
      throw new Error("Failed to send new code");
    }

    return { success: true };
  },
};
