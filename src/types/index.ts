export interface LoginData {
  email: string;
  password: string;
}

export interface NumbersAuth {
  code: string;
}

export interface ApiError {
  message: string;
  code?: string;
}
