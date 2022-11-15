import { useApiMutation } from "../Client";
import { User } from "../Types";

export default function useRegister() {
  return useApiMutation<User>("/register");
}
