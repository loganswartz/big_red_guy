import { useApiMutation } from "../../Client";
import { Party } from "../../Types";

export default function useAddParty() {
  return useApiMutation<Party>("/me/parties");
}
