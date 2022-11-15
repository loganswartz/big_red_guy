import { useApiQuery } from "../../Client";
import { Party } from "../../Types";

export default function useParty(id: number | string) {
  return useApiQuery<Party>(`/me/parties/${id}`);
}
