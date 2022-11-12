import { EditIcon } from "@chakra-ui/icons";
import { useToast } from "@chakra-ui/react";
import WishlistModal, {
  WishlistFormValues,
} from "../App/Wishlists/WishlistModal";
import useEditWishlist from "../Global/Api/Mutations/useEditWishlist";
import { Wishlist } from "../Global/Api/Queries/useAllWishlists";
import useModalState from "../Global/Helpers/ModalHelper";
import FlexButton, { FlexButtonVariant } from "./FlexButton";

export default function EditWishlistButton(props: EditWishlistButtonProps) {
  const { list, refetch, variant } = props;

  const [open, modal] = useModalState();
  const { mutateAsync } = useEditWishlist(list.id);
  const toast = useToast();

  async function onSubmit(data: WishlistFormValues) {
    await mutateAsync({ data });
    refetch?.();
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
  refetch?: () => void;
  variant?: FlexButtonVariant;
}
