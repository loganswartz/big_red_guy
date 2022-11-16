import { useApiMutation } from "../../Client";
import { Party } from "../../Types/Api";

export default function useAddParty() {
  return useApiMutation<Party>({
    path: "/me/parties",
  });
}
