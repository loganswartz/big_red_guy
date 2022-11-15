import { useApiQuery } from "../Client";
import { User } from "../Types";

export default function useCurrentUser() {
  return useApiQuery<User>("/me");
}
