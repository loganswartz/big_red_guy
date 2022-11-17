import { useApiMutation } from "../../Client";
import { ID } from "../../Types/Utility";

export default function useAddPartyMemberByEmail(partyId: ID) {
  return useApiMutation<null>({
    path: `/me/parties/${partyId}/users/add`,
    method: "PUT",
  });
}
