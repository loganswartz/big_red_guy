import { useApiMutation } from "../Client";

export default function useLogout() {
  const { mutateAsync } = useApiMutation<{}>("/logout");
  return () => mutateAsync({});
}
