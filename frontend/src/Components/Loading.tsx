import { AbsoluteCenter, CircularProgress } from "@chakra-ui/react";

export default function Loading() {
  return (
    <AbsoluteCenter>
      <CircularProgress isIndeterminate />
    </AbsoluteCenter>
  );
}
