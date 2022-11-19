import {
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
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import useWishlist from "../../Global/Api/Queries/Wishlists/useWishlist";
import useWishlistItems from "../../Global/Api/Queries/Wishlists/useWishlistItems";
import Loading from "../../Components/Loading";
import WishlistListItem from "./WishlistListItem";
import EditWishlistButton from "./Components/EditWishlistButton";
import AddWishlistItemButton from "./Components/AddWishlistItemButton";

export default function ViewWishlist() {
  const { id = "" } = useParams<{ id: string }>();

  const { data: wishlist, isInitialLoading: wishlistLoading } = useWishlist(id);
  const {
    data: items,
    isInitialLoading: wishlistItemsLoading,
    refetch: refetchItems,
  } = useWishlistItems(id);

  if (wishlistLoading || wishlistItemsLoading) {
    return <Loading />;
  } else if (!wishlist || !items) {
    return <>Wishlist not found.</>;
  }

  return (
    <Card>
      <CardHeader>
        <Center>
          <HStack spacing={2}>
            <Heading>{wishlist.name}</Heading>
            <EditWishlistButton list={wishlist} variant="icon" />
          </HStack>
        </Center>
      </CardHeader>
      <Divider />
      <CardBody>
        <List spacing={2}>
          {items.length === 0 ? (
            <ListItem>
              <i>You don't have any items in this list yet.</i>
            </ListItem>
          ) : (
            items.map((item) => (
              <ListItem>
                <WishlistListItem item={item} refetch={refetchItems} canEdit />
              </ListItem>
            ))
          )}
        </List>
      </CardBody>
      <CardFooter justifyContent="center">
        <AddWishlistItemButton listId={wishlist.id} />
      </CardFooter>
    </Card>
  );
}
