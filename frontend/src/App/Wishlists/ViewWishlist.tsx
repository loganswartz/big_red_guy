import {
  Center,
  Divider,
  Heading,
  HStack,
  List,
  ListItem,
  VStack,
} from "@chakra-ui/react";
import Card from "../../Components/Card";
import { useParams } from "react-router-dom";
import useWishlist from "../../Global/Api/Queries/Wishlists/useWishlist";
import useWishlistItems from "../../Global/Api/Queries/Wishlists/useWishlistItems";
import Loading from "../../Components/Loading";
import WishlistListItem from "./WishlistListItem";
import EditWishlistButton from "./Components/EditWishlistButton";
import AddWishlistItemButton from "./Components/AddWishlistItemButton";

export default function ViewWishlist() {
  const { id = "" } = useParams<{ id: string }>();

  const {
    data: wishlist,
    isInitialLoading: wishlistLoading,
    refetch: refetchList,
  } = useWishlist(id);
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
      <VStack spacing={4}>
        <Center>
          <HStack spacing={2}>
            <Heading>{wishlist.name}</Heading>
            <EditWishlistButton
              list={wishlist}
              refetch={refetchList}
              variant="icon"
            />
          </HStack>
        </Center>
        <Divider />
        <List spacing={2}>
          {items.length === 0 ? (
            <ListItem>
              <i>You don't have any items in this list yet.</i>
            </ListItem>
          ) : (
            items.map((item) => (
              <ListItem>
                <WishlistListItem item={item} refetch={refetchItems} />
              </ListItem>
            ))
          )}
        </List>
        <Center>
          <AddWishlistItemButton listId={wishlist.id} refetch={refetchItems} />
        </Center>
      </VStack>
    </Card>
  );
}
