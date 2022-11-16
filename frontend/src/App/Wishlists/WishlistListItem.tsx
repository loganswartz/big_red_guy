import { DeleteIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import { HStack, Tag, Link, useToast, IconButton } from "@chakra-ui/react";
import EditButton from "../../Components/EditButton";
import useDeleteWishlistItem from "../../Global/Api/Mutations/Wishlists/useDeleteWishlistItem";
import useEditWishlistItem from "../../Global/Api/Mutations/Wishlists/useEditWishlistItem";
import { WishlistItem } from "../../Global/Api/Types/Api";
import useModalState from "../../Global/Helpers/ModalHelper";
import WishlistItemModal, {
  WishlistItemFormValues,
} from "./Components/WishlistItemModal";

export default function WishlistListItem(props: WishlistListItemProps) {
  const { item, refetch } = props;

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
        <Link href={item.url ?? "#"} isExternal>
          {item.name} {item.url && <ExternalLinkIcon />}
        </Link>
        <Tag>Qty: {item.quantity ?? "No limit"}</Tag>
        <EditButton onClick={modal.open} />
        <IconButton
          aria-label={`Delete ${item.name}`}
          icon={<DeleteIcon />}
          onClick={onDelete}
        />
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
}
