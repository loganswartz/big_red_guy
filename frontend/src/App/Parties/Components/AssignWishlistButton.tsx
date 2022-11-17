import { EditIcon } from "@chakra-ui/icons";
import { Party } from "../../../Global/Api/Types/Api";
import useModalState from "../../../Global/Helpers/ModalHelper";
import FlexButton, { FlexButtonVariant } from "../../../Components/FlexButton";
import AssignWishlistModal from "./AssignWishlistModal";

export default function AssignWishlistButton(props: AssignWishlistButtonProps) {
  const { party, variant } = props;

  const [open, modal] = useModalState();

  return (
    <>
      <FlexButton
        title="Set your lists"
        icon={<EditIcon />}
        onClick={modal.open}
        variant={variant}
      />
      <AssignWishlistModal party={party} open={open} setOpen={modal.set} />
    </>
  );
}

interface AssignWishlistButtonProps {
  party: Party;
  variant?: FlexButtonVariant;
}
