import { useApiQuery } from "../../Client";
import { Party } from "../../Types/Api";

export default function useParty(id: number | string) {
  return useApiQuery<Party>(`/me/parties/${id}`);
}
