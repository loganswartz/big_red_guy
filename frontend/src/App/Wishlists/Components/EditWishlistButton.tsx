import { EditIcon } from "@chakra-ui/icons";
import { useToast } from "@chakra-ui/react";
import WishlistModal from "./WishlistModal";
import useEditWishlist from "../../../Global/Api/Mutations/Wishlists/useEditWishlist";
import { Wishlist } from "../../../Global/Api/Types/Api";
import useModalState from "../../../Global/Helpers/ModalHelper";
import FlexButton, { FlexButtonVariant } from "../../../Components/FlexButton";
import { EditWishlistInput } from "../../../Global/Api/Mutations/Wishlists/useEditWishlist";

export default function EditWishlistButton(props: EditWishlistButtonProps) {
  const { list, variant } = props;

  const [open, modal] = useModalState();
  const { mutateAsync } = useEditWishlist(list.id);
  const toast = useToast();

  async function onSubmit(data: EditWishlistInput) {
    await mutateAsync({ data });
    toast({
      description: `Successfully updated list!`,
    });
  }

  return (
    <>
      <FlexButton
        title="Edit list"
        icon={<EditIcon />}
        onClick={modal.open}
        variant={variant}
      />
      <WishlistModal
        title="Edit Wishlist"
        initialValues={list}
        onSubmit={onSubmit}
        open={open}
        setOpen={modal.set}
      />
    </>
  );
}

interface EditWishlistButtonProps {
  list: Wishlist;
  variant?: FlexButtonVariant;
}
