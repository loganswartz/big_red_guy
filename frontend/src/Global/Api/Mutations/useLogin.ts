import { useApiMutation } from "../Client";

interface LoginResponse {
  success: boolean;
}

export default function useLogin() {
  return useApiMutation<LoginResponse>("/login");
}
