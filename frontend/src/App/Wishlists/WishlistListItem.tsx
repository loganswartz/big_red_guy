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
import useEditWishlistItem from "../../Global/Api/Mutations/Wishlists/useEditWishlistItem";
import { WishlistItem } from "../../Global/Api/Types/Api";
import useModalState from "../../Global/Helpers/ModalHelper";
import WishlistItemModal, {
  WishlistItemFormValues,
} from "./Components/WishlistItemModal";

export default function WishlistListItem(props: WishlistListItemProps) {
  const { item, refetch, canEdit = false } = props;

  const [open, modal] = useModalState();
  const { mutateAsync: editItem } = useEditWishlistItem(item.id);
  const { mutateAsync: deleteItem } = useDeleteWishlistItem(item.id);
  const toast = useToast();

  async function onEdit(data: WishlistItemFormValues) {
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
          {item.quantity ? (
            <Tag borderRadius="full" colorScheme="green">
              Amount: {item.quantity}
            </Tag>
          ) : null}
        </HStack>
        {canEdit ? (
          <HStack spacing={1}>
            <EditButton onClick={modal.open} />
            <IconButton
              aria-label={`Delete ${item.name}`}
              icon={<DeleteIcon />}
              onClick={onDelete}
            />
          </HStack>
        ) : null}
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
  refetch?: () => void;
  canEdit?: boolean;
}
