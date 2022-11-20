import { useApiMutation } from "../Client";
import { AuthResponse } from "../Types/Api";

export default function useLogout() {
  const { mutateAsync } = useApiMutation<any, AuthResponse>({
    path: "/logout",
  });
  return () => mutateAsync({});
}
