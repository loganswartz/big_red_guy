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
import AddWishlistButton from "../../Components/AddWishlistButton";
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
      <VStack spacing={4}>
        <Center>
          <Heading>Your Wishlists</Heading>
        </Center>
        <Divider />
        <HStack>
          <List spacing={1}>
            {wishlists.length === 0 ? (
              <ListItem>You don't have any lists yet.</ListItem>
            ) : (
              wishlists.map((list) => (
                <ListItem>
                  <HStack justifyContent="space-between">
                    <Text fontSize="lg">{list.name}</Text>
                    <Text fontSize="lg">-</Text>
                    <Button
                      as={ReactRouterLink}
                      to={`/app/wishlists/${list.id}`}
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
          <AddWishlistButton />
        </Center>
      </VStack>
    </Card>
  );
}
