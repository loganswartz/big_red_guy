import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  Divider,
  Heading,
  HStack,
  List,
  ListItem,
  Text,
} from "@chakra-ui/react";
import { Link as ReactRouterLink } from "react-router-dom";
import AddPartyButton from "./Components/AddPartyButton";
import Loading from "../../Components/Loading";
import useAllParties from "../../Global/Api/Queries/Parties/useAllParties";

export default function PartiesIndex() {
  const { data, isInitialLoading } = useAllParties();

  if (isInitialLoading) {
    return <Loading />;
  }

  const parties = data ?? [];

  return (
    <Card>
      <CardHeader>
        <Center>
          <Heading>Your Parties</Heading>
        </Center>
      </CardHeader>
      <Divider />
      <CardBody>
        <List spacing={1}>
          {parties.length === 0 ? (
            <ListItem>You don't have any parties yet.</ListItem>
          ) : (
            parties.map((party) => (
              <ListItem>
                <HStack justifyContent="space-between">
                  <Text fontSize="lg">{party.name}</Text>
                  <Text fontSize="lg">—</Text>
                  <Button as={ReactRouterLink} to={`/app/parties/${party.id}`}>
                    View
                  </Button>
                </HStack>
              </ListItem>
            ))
          )}
        </List>
      </CardBody>
      <CardFooter justifyContent="center">
        <AddPartyButton />
      </CardFooter>
    </Card>
  );
}
