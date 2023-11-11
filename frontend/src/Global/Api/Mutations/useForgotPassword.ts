import { useApiMutation } from "../Client";
import { AuthResponse } from "../Types/Api";

export interface ForgotPasswordInput {
  email: string;
}

export default function useForgotPassword() {
  return useApiMutation<ForgotPasswordInput, AuthResponse>({
    path: "/forgot-password",
  });
}
