import {
  Button,
  Center,
  Heading,
  HStack,
  List,
  ListItem,
  VStack,
} from "@chakra-ui/react";
import { Link as ReactRouterLink } from "react-router-dom";
import Card from "../../Components/Card";
import Loading from "../../Components/Loading";
import useAllWishlists from "../../Global/Api/Queries/useAllWishlists";

export default function WishlistsIndex() {
  const { data, isInitialLoading } = useAllWishlists();

  if (isInitialLoading) {
    return <Loading />;
  }

  const wishlists = data ?? [];

  return (
    <Card>
      <VStack>
        <Center>
          <Heading>Your Wishlists</Heading>
        </Center>
        <HStack>
          <List>
            {wishlists.length === 0 ? (
              <ListItem>You don't have any lists yet.</ListItem>
            ) : (
              wishlists.map((list) => (
                <ListItem>
                  {list.name}&nbsp;-&nbsp;
                  <Button as={ReactRouterLink} to={`/app/wishlists/${list.id}`}>
                    View
                  </Button>
                </ListItem>
              ))
            )}
          </List>
        </HStack>
        <Center>
          <Button as={ReactRouterLink} to="/app/wishlists/add">
            Add a list
          </Button>
        </Center>
      </VStack>
    </Card>
  );
}
