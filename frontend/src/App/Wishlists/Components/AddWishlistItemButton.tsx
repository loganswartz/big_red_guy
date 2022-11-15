import { AddIcon } from "@chakra-ui/icons";
import { useToast } from "@chakra-ui/react";
import WishlistItemModal, { WishlistItemFormValues } from "./WishlistItemModal";
import useCreateWishlistItem from "../../../Global/Api/Mutations/Wishlists/useCreateWishlistItem";
import useModalState from "../../../Global/Helpers/ModalHelper";
import FlexButton, { FlexButtonVariant } from "../../../Components/FlexButton";

export default function AddWishlistItemButton(
  props: AddWishlistItemButtonProps
) {
  const { variant, listId, refetch } = props;

  const [open, modal] = useModalState();
  const { mutateAsync } = useCreateWishlistItem(listId);
  const toast = useToast();

  async function onSubmit(data: WishlistItemFormValues) {
    try {
      const result = await mutateAsync({ json: data });
      toast({
        title: `Added "${result.name}"!`,
        status: "success",
      });
      refetch?.();
    } catch (e: any) {
      toast({
        title: "Unable to save item",
        description: e.toString(),
        status: "error",
      });
    }
  }

  return (
    <>
      <FlexButton
        icon={<AddIcon />}
        title="Add an item"
        variant={variant}
        onClick={modal.open}
      />
      <WishlistItemModal onSubmit={onSubmit} open={open} setOpen={modal.set} />
    </>
  );
}

interface AddWishlistItemButtonProps {
  variant?: FlexButtonVariant;
  listId?: string | number;
  refetch?: () => void;
}
