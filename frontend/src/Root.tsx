import { VStack } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";

export default function Root() {
  return (
    <VStack sx={{ width: "100vw", minHeight: "100vh" }}>
      <Outlet />
    </VStack>
  );
}
