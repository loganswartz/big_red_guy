import {
  Center,
  Container,
  Heading,
  List,
  ListItem,
  VStack,
} from "@chakra-ui/react";
import { Wishlist } from "../../Global/Api/Types";
import Card from "../../Components/Card";

export default function ViewWishlist(props: ViewWishlistProps) {
  const { wishlist } = props;

  return (
    <Container maxWidth="md">
      <Card>
        <VStack>
          <Center>
            <Heading>{wishlist.name}</Heading>
          </Center>
          <List>
            {wishlist.items.length === 0 ? (
              <ListItem>
                <i>You don't have any items in this list yet.</i>
              </ListItem>
            ) : (
              wishlist.items.map((item) => <ListItem>{item.name}</ListItem>)
            )}
          </List>
        </VStack>
      </Card>
    </Container>
  );
}

interface ViewWishlistProps {
  wishlist: Wishlist;
}
