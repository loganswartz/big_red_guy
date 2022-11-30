import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  Container,
} from "@chakra-ui/react";
import { Link as ReactRouterLink } from "react-router-dom";
import BigRedGuy from "../Components/BigRedGuy";

export default function FrontPage() {
  return (
    <Container height="100%" justifyContent="center" centerContent>
      <Card>
        <CardHeader>
          <Center>
            <BigRedGuy />
          </Center>
        </CardHeader>
        <CardBody>
          <Box>A "Secret Santa" manager written in Rust.</Box>
        </CardBody>
        <CardFooter justifyContent="space-evenly">
          <Button as={ReactRouterLink} to="/register">
            Register
          </Button>
          <Button as={ReactRouterLink} to="/login">
            Login
          </Button>
        </CardFooter>
      </Card>
    </Container>
  );
}
