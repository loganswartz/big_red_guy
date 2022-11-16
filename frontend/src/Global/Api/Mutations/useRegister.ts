import { useApiMutation } from "../Client";
import { User } from "../Types/Api";

export default function useRegister() {
  return useApiMutation<User>({
    path: "/register",
  });
}
