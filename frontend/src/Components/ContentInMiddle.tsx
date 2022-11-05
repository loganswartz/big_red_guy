import { AbsoluteCenter, Box } from "@chakra-ui/react";
import { PropsWithChildren } from "react";

export default function ContentInMiddle(props: PropsWithChildren<{}>) {
  return (
    <Box sx={{ height: "100vh", width: "100vw" }}>
      <AbsoluteCenter>{props.children}</AbsoluteCenter>
    </Box>
  );
}
