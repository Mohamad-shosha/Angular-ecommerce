// src/app/components/auth/auth.model.ts

export interface RegisterForm {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
}

export interface LoginForm {
  email: string;
  password: string;
}
