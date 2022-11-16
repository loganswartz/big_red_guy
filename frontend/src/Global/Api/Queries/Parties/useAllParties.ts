import { useApiQuery } from "../../Client";
import { Party } from "../../Types/Api";

export default function useAllParties() {
  return useApiQuery<Party[]>("/me/parties");
}
