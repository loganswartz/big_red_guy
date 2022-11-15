import {
  Button,
  Center,
  Divider,
  Heading,
  HStack,
  List,
  ListItem,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Link as ReactRouterLink } from "react-router-dom";
import AddPartyButton from "./Components/AddPartyButton";
import Card from "../../Components/Card";
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
      <VStack spacing={4}>
        <Center>
          <Heading>Your Parties</Heading>
        </Center>
        <Divider />
        <HStack>
          <List spacing={1}>
            {parties.length === 0 ? (
              <ListItem>You don't have any parties yet.</ListItem>
            ) : (
              parties.map((party) => (
                <ListItem>
                  <HStack justifyContent="space-between">
                    <Text fontSize="lg">{party.name}</Text>
                    <Text fontSize="lg">-</Text>
                    <Button
                      as={ReactRouterLink}
                      to={`/app/parties/${party.id}`}
                    >
                      View
                    </Button>
                  </HStack>
                </ListItem>
              ))
            )}
          </List>
        </HStack>
        <Center>
          <AddPartyButton />
        </Center>
      </VStack>
    </Card>
  );
}
