import { useApiQuery } from "../../Client";
import { User } from "../../Types/Api";

export default function usePartyMembers(id: number | string) {
  return useApiQuery<User[]>(`/me/parties/${id}/members`);
}
