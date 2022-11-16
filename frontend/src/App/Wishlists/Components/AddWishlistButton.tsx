import { AddIcon } from "@chakra-ui/icons";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import WishlistModal, { WishlistFormValues } from "./WishlistModal";
import useAddWishlist from "../../../Global/Api/Mutations/Wishlists/useCreateWishlist";
import useModalState from "../../../Global/Helpers/ModalHelper";
import FlexButton, { FlexButtonVariant } from "../../../Components/FlexButton";

export default function AddWishlistButton(props: AddWishlistButtonProps) {
  const { variant } = props;

  const [open, modal] = useModalState();
  const { mutateAsync } = useAddWishlist();
  const toast = useToast();
  const navigate = useNavigate();

  async function onSubmit(data: WishlistFormValues) {
    try {
      const created = await mutateAsync({ data });
      if (created) {
        navigate(`/app/wishlists/${created.id}`);
      }
    } catch (e: any) {
      toast({
        title: "An error occurred.",
        description: e.toString(),
        status: "error",
      });
    }
  }

  return (
    <>
      <FlexButton
        icon={<AddIcon />}
        title="Add a list"
        variant={variant}
        onClick={modal.open}
      />
      <WishlistModal onSubmit={onSubmit} open={open} setOpen={modal.set} />
    </>
  );
}

interface AddWishlistButtonProps {
  variant?: FlexButtonVariant;
}
