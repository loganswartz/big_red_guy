import { useApiMutation } from "../../Client";
import { Party } from "../../Types";

export default function useEditParty(id: string | number) {
  return useApiMutation<Party>(`/me/parties/${id}`, {
    method: "PUT",
  });
}
