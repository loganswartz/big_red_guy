import { useApiMutation } from "../Client";

export default function useLogout() {
  const { mutateAsync } = useApiMutation<{}>({
    path: "/logout",
  });
  return () => mutateAsync({});
}
