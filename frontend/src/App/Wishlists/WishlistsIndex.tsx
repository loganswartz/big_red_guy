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
import AddWishlistButton from "./Components/AddWishlistButton";
import Loading from "../../Components/Loading";
import useAllWishlists from "../../Global/Api/Queries/Wishlists/useAllWishlists";

export default function WishlistsIndex() {
  const { data, isInitialLoading } = useAllWishlists();

  if (isInitialLoading) {
    return <Loading />;
  }

  const wishlists = data ?? [];

  return (
    <Card>
      <CardHeader>
        <Center>
          <Heading>Your Wishlists</Heading>
        </Center>
      </CardHeader>
      <Divider />
      <CardBody>
        <List spacing={1}>
          {wishlists.length === 0 ? (
            <ListItem>You don't have any lists yet.</ListItem>
          ) : (
            wishlists.map((list) => (
              <ListItem key={list.id}>
                <HStack justifyContent="space-between">
                  <Text fontSize="lg">{list.name}</Text>
                  <Text fontSize="lg">—</Text>
                  <Button as={ReactRouterLink} to={`/app/wishlists/${list.id}`}>
                    View
                  </Button>
                </HStack>
              </ListItem>
            ))
          )}
        </List>
      </CardBody>
      <CardFooter justifyContent="center">
        <AddWishlistButton />
      </CardFooter>
    </Card>
  );
}
