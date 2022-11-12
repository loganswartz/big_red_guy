import { ExternalLinkIcon } from "@chakra-ui/icons";
import { HStack, IconButton, Tag, Text, useToast } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import EditButton from "../../Components/EditButton";
import useEditWishlistItem from "../../Global/Api/Mutations/useEditWishlistItem";
import { WishlistItem } from "../../Global/Api/Queries/useWishlistItems";
import useModalState from "../../Global/Helpers/ModalHelper";
import WishlistItemModal, { WishlistItemFormValues } from "./WishlistItemModal";

export default function WishlistListItem(props: WishlistListItemProps) {
  const { item, refetch } = props;

  const [open, modal] = useModalState();
  const { mutateAsync } = useEditWishlistItem(item.id);
  const toast = useToast();

  async function editItem(data: WishlistItemFormValues) {
    await mutateAsync({ data });
    refetch?.();
    toast({
      description: `Successfully updated "${item.name}"!`,
    });
  }

  return (
    <>
      <HStack spacing={4} justifyContent="space-between">
        <Text fontSize="lg">{item.name}</Text>
        <Tag>Qty: {item.quantity ?? "No limit"}</Tag>
        {item.url && (
          <IconButton
            icon={<ExternalLinkIcon />}
            aria-label="Link to the item on another site"
            as="a"
            target="_blank"
            href={item.url}
          />
        )}
        <EditButton onClick={modal.open} />
      </HStack>
      <WishlistItemModal
        open={open}
        setOpen={modal.set}
        initialValues={item}
        onSubmit={editItem}
      />
    </>
  );
}

interface WishlistListItemProps {
  item: WishlistItem;
  refetch?: () => void;
}
