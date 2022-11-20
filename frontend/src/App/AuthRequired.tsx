import { Container } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import Appbar from "../Components/Appbar";
import useCurrentUser from "../Global/Api/Queries/useCurrentUser";

export default function AuthRequired() {
  useCurrentUser();

  return (
    <>
      <Appbar />
      <Container flexGrow={1} justifyContent="center" centerContent>
        <Outlet />
      </Container>
    </>
  );
}
