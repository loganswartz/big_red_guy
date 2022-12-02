import { Container } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import Appbar from "./Components/Appbar";
import useCurrentUser from "../Global/Api/Queries/useCurrentUser";

export default function AuthRequired() {
  // ensure the user is logged in
  // if not, using this hook will cause a redirect to the login page
  useCurrentUser();

  return (
    <>
      <Appbar />
      <Container maxW="100%" flexGrow={1} justifyContent="center" centerContent>
        <Outlet />
      </Container>
    </>
  );
}
