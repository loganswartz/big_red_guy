import { VStack } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";

export default function Root() {
  return (
    <VStack width="100%" minHeight="100vh" pb={4}>
      <Outlet />
    </VStack>
  );
}
