import { useApiMutation } from "../Client";

export default function usePfp() {
  return useApiMutation<null>({
    path: "/me/pfp",
    method: "PUT",
  });
}
