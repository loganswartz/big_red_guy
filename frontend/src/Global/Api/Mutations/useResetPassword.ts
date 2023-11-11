import { useApiMutation } from "../Client";
import { AuthResponse } from "../Types/Api";

export interface ResetPasswordInput {
  token: string;
  password: string;
}

export default function useResetPassword() {
  return useApiMutation<ResetPasswordInput, AuthResponse>({
    path: "/reset-password",
  });
}
