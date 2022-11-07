import {
  Button,
  Center,
  Container,
  Heading,
  List,
  ListItem,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import Card from "../../Components/Card";
import { useParams } from "react-router-dom";
import useWishlist from "../../Global/Api/Queries/useWishlist";
import useWishlistItems from "../../Global/Api/Queries/useWishlistItems";
import useDialogState from "../../Global/Helpers/DialogHelper";
import AddWishlistItemModal, {
  AddWishlistItemFormValues,
} from "./AddWishlistItemModal";
import Loading from "../../Components/Loading";
import useAddWishlistItem from "../../Global/Api/Mutations/useAddWishlistItem";

export default function ViewWishlist() {
  const { id = "" } = useParams<{ id: string }>();
  const [open, dialog] = useDialogState();
  const toast = useToast();

  const { data: wishlist, isInitialLoading: wishlistLoading } = useWishlist(id);
  const { data: items, isInitialLoading: wishlistItemsLoading } =
    useWishlistItems(id);
  const { mutateAsync } = useAddWishlistItem(id);

  if (wishlistLoading || wishlistItemsLoading) {
    return <Loading />;
  } else if (!wishlist || !items) {
    return <>Wishlist not found.</>;
  }

  async function addItem(data: AddWishlistItemFormValues) {
    try {
      const result = await mutateAsync({ data });
      toast({
        title: `Added "${result.name}"!`,
        status: "success",
      });
    } catch (e: any) {
      toast({
        title: "Unable to save item",
        description: e.toString(),
        status: "error",
      });
    }
  }

  return (
    <Container maxWidth="md">
      <Card>
        <VStack>
          <Center>
            <Heading>{wishlist.name}</Heading>
          </Center>
          <List spacing={2}>
            {items.length === 0 ? (
              <ListItem>
                <i>You don't have any items in this list yet.</i>
              </ListItem>
            ) : (
              items.map((item) => <ListItem>{item.name}</ListItem>)
            )}
            <ListItem>
              <Center>
                <Button onClick={dialog.open} rightIcon={<AddIcon />}>
                  Add an item
                </Button>
              </Center>
            </ListItem>
          </List>
        </VStack>
      </Card>
      <AddWishlistItemModal
        open={open}
        setOpen={dialog.set}
        onSubmit={addItem}
      />
    </Container>
  );
}
