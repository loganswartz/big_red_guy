import { useApiMutation } from "../../Client";
import { Party } from "../../Types/Api";

export default function useEditParty(id: string | number) {
  return useApiMutation<Party>({
    path: `/me/parties/${id}`,
    method: "PUT",
  });
}
