import { useApiMutation } from "../../Client";
import { Party } from "../../Types/Api";

export type AddPartyInput = Omit<Party, "id" | "owner_id">;

export default function useAddParty() {
  return useApiMutation<AddPartyInput, Party>({
    path: "/me/parties",
  });
}
