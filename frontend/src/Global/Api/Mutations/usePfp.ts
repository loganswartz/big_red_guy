import { useApiMutation } from "../Client";

export default function usePfp() {
  return useApiMutation<any, null>({
    path: "/me/pfp",
    method: "PUT",
  });
}
