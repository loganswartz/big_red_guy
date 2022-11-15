import { useApiMutation } from "../Client";
import { LoginResponse } from "../Types";

export default function useLogin() {
  return useApiMutation<LoginResponse>("/login");
}
