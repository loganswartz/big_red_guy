import { CheckIcon } from "@chakra-ui/icons";
import { useToast } from "@chakra-ui/react";
import { WishlistItem } from "../../../Global/Api/Types/Api";
import useModalState from "../../../Global/Helpers/ModalHelper";
import FlexButton, { FlexButtonVariant } from "../../../Components/FlexButton";
import useFulfillItem from "../../../Global/Api/Mutations/Fulfillments/useFulfillItem";
import FulfillItemModal, { FulfillItemFormValues } from "./FulfillItemModal";

export default function FulfillItemButton(props: FulfillItemButtonProps) {
  const { item, variant } = props;

  const [open, modal] = useModalState();
  const { mutateAsync } = useFulfillItem();
  const toast = useToast();

  async function onSubmit(data: FulfillItemFormValues) {
    await mutateAsync({
      data: {
        wishlist_item_id: item.id,
        ...data,
      },
    });
    toast({
      description: `Marked ${data.quantity} of ${item.name} as completed!`,
    });
  }

  return (
    <>
      <FlexButton
        title="Fulfill"
        icon={<CheckIcon />}
        onClick={modal.open}
        variant={variant}
      />
      <FulfillItemModal
        title={`Fulfill ${item.name}`}
        onSubmit={onSubmit}
        open={open}
        setOpen={modal.set}
      />
    </>
  );
}

interface FulfillItemButtonProps {
  item: WishlistItem;
  variant?: FlexButtonVariant;
}
