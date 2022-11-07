import { CircularProgress } from "@chakra-ui/react";
import ContentInMiddle from "./ContentInMiddle";

export default function Loading() {
  return (
    <ContentInMiddle>
      <CircularProgress isIndeterminate />
    </ContentInMiddle>
  );
}
