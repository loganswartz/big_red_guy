import { useApiMutation } from "../../Client";
import { Party } from "../../Types/Api";
import { ID } from "../../Types/Utility";

interface Parameters {
  partyId: ID;
  listId: ID;
}

export default function useAssignListToParty() {
  const template = (values: Parameters) => {
    const { partyId, listId } = values;

    return `/me/parties/${partyId}/wishlists/${listId}`;
  };

  return useApiMutation<Party, typeof template>({
    path: template,
    method: "PUT",
  });
}
