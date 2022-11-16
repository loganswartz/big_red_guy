import { useApiMutation } from "../Client";
import { LoginResponse } from "../Types/Api";

export default function useLogin() {
  return useApiMutation<LoginResponse>({
    path: "/login",
  });
}
