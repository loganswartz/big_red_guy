import { useApiQuery } from "../Client";
import { User } from "../Types/Api";

export default function useCurrentUser() {
  return useApiQuery<User>("/me");
}
