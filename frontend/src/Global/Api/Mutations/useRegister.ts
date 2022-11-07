import { useApiMutation } from "../Client";
import { User } from "../Queries/useCurrentUser";

export default function useRegister() {
  return useApiMutation<User>("/register");
}
