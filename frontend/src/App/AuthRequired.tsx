import { VStack } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import Appbar from "../Components/Appbar";
import useCurrentUser from "../Global/Api/Queries/useCurrentUser";

export default function AuthRequired() {
  useCurrentUser();

  return (
    <>
      <Appbar />
      <VStack sx={{ width: "100vw", flexGrow: 1 }} justifyContent="center">
        <Outlet />
      </VStack>
    </>
  );
}
