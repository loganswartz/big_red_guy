import { DeleteIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import {
  HStack,
  Tag,
  Link,
  useToast,
  IconButton,
  Text,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
} from "@chakra-ui/react";
import EditButton from "../../Components/EditButton";
import useDeleteWishlistItem from "../../Global/Api/Mutations/Wishlists/useDeleteWishlistItem";
import useEditWishlistItem, {
  EditWishlistItemInput,
} from "../../Global/Api/Mutations/Wishlists/useEditWishlistItem";
import useCurrentUser from "../../Global/Api/Queries/useCurrentUser";
import { Fulfillment, WishlistItem } from "../../Global/Api/Types/Api";
import useModalState from "../../Global/Helpers/ModalHelper";
import WishlistItemModal from "./Components/WishlistItemModal";
import FulfillItemButton from "./Components/FulfillItemButton";

export default function WishlistListItem(props: WishlistListItemProps) {
  const { item, fulfillments, refetch } = props;

  const [open, modal] = useModalState();
  const { data: me } = useCurrentUser();
  const { mutateAsync: editItem } = useEditWishlistItem(item.id);
  const { mutateAsync: deleteItem } = useDeleteWishlistItem(item.id);
  const toast = useToast();

  const canEdit = me?.id === item.owner_id;

  async function onEdit(data: EditWishlistItemInput) {
    try {
      await editItem({ data });
      refetch?.();
      toast({
        description: `Successfully updated "${item.name}"!`,
      });
    } catch (e: any) {
      toast({
        status: "error",
        title: "Failed to update item.",
        description: e.toString(),
      });
    }
  }

  async function onDelete() {
    try {
      await deleteItem({});
      refetch?.();
      toast({
        description: `Successfully deleted "${item.name}"!`,
      });
    } catch (e: any) {
      toast({
        status: "error",
        title: "Failed to delete item.",
        description: e.toString(),
      });
    }
  }

  const needed = item.quantity;
  const qtyFulfilled = (fulfillments ?? []).reduce(
    (sum, entry) => sum + entry.quantity,
    0
  );
  // finished if there's a set quantity needed AND that amount has been fulfilled
  // items with no quantity means there is no upper limit
  const isFullyFulfilled = needed && qtyFulfilled >= needed;

  return (
    <>
      <HStack spacing={4} justifyContent="space-between">
        {item.url ? (
          <Link href={item.url} isExternal>
            {item.name} <ExternalLinkIcon />
          </Link>
        ) : (
          <Text>{item.name}</Text>
        )}
        <HStack spacing={1}>
          {item.notes ? (
            <Popover>
              <PopoverTrigger>
                <Button size="xs">See Notes</Button>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverArrow />
                <PopoverBody>{item.notes}</PopoverBody>
              </PopoverContent>
            </Popover>
          ) : null}
          <Tag borderRadius="full" colorScheme="green">
            {!fulfillments
              ? `Want: ${needed ?? "∞"}`
              : `${qtyFulfilled} / ${needed ?? "∞"}`}
          </Tag>
        </HStack>
        <HStack spacing={1}>
          {canEdit ? (
            <>
              <EditButton onClick={modal.open} />
              <IconButton
                aria-label={`Delete ${item.name}`}
                icon={<DeleteIcon />}
                onClick={onDelete}
              />
            </>
          ) : !isFullyFulfilled ? (
            <FulfillItemButton item={item} />
          ) : (
            <Tag>Done!</Tag>
          )}
        </HStack>
      </HStack>
      <WishlistItemModal
        open={open}
        setOpen={modal.set}
        initialValues={item}
        onSubmit={onEdit}
      />
    </>
  );
}

interface WishlistListItemProps {
  item: WishlistItem;
  fulfillments?: Fulfillment[];
  refetch?: () => void;
}
