import { useApiMutation } from "../../Client";
import { User } from "../../Types/Api";
import { ID } from "../../Types/Utility";

export type AddPartyMemberByEmailInput = Pick<User, "email">;

export default function useAddPartyMemberByEmail(partyId: ID) {
  return useApiMutation<AddPartyMemberByEmailInput, null>({
    path: `/me/parties/${partyId}/users/add`,
    method: "PUT",
  });
}
