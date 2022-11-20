import { useApiMutation } from "../Client";
import { User } from "../Types/Api";

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export default function useRegister() {
  return useApiMutation<RegisterInput, User>({
    path: "/register",
  });
}
