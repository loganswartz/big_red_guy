import { useApiMutation } from "../../Client";
import { User } from "../../Types/Api";
import { ID } from "../../Types/Utility";

interface Parameters {
  partyId: ID;
  userId: ID;
}

export default function useAssignPartyMember() {
  const template = (values: Parameters) => {
    const { partyId, userId } = values;

    return `/me/parties/${partyId}/users/${userId}`;
  };

  return useApiMutation<User[], typeof template>({
    path: template,
    method: "PUT",
  });
}
