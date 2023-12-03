import { Icon } from "@chakra-ui/react";
import { RiFileList3Fill } from "react-icons/ri";
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
        title="Assign Lists"
        icon={<Icon as={RiFileList3Fill} />}
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
