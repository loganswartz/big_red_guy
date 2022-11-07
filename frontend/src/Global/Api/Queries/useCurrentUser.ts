import { useApiQuery } from "../Client";

export interface User {
  email: string;
  name: string;
}

export default function useCurrentUser() {
  return useApiQuery<User>("/me");
}
