import { useApiQuery } from "../../Client";
import { Party } from "../../Types";

export default function useAllParties() {
  return useApiQuery<Party[]>("/me/parties");
}
