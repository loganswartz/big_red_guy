import { useApiMutation } from "../../Client";
import { Party } from "../../Types/Api";
import { AddPartyInput } from "./useAddParty";

export interface EditPartyInput extends AddPartyInput {}

export default function useEditParty(id: string | number) {
  return useApiMutation<EditPartyInput, Party>({
    path: `/me/parties/${id}`,
    method: "PUT",
  });
}
