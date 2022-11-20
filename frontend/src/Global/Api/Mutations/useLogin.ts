import { useApiMutation } from "../Client";
import { AuthResponse } from "../Types/Api";

export interface LoginInput {
  email: string;
  password: string;
}

export default function useLogin() {
  return useApiMutation<LoginInput, AuthResponse>({
    path: "/login",
  });
}
