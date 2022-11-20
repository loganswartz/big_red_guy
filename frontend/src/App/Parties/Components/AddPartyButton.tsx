import { AddIcon } from "@chakra-ui/icons";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import PartyModal from "./PartyModal";
import useAddParty, {
  AddPartyInput,
} from "../../../Global/Api/Mutations/Parties/useAddParty";
import useModalState from "../../../Global/Helpers/ModalHelper";
import FlexButton, { FlexButtonVariant } from "../../../Components/FlexButton";

export default function AddPartyButton(props: AddPartyButtonProps) {
  const { variant } = props;

  const [open, modal] = useModalState();
  const { mutateAsync } = useAddParty();
  const toast = useToast();
  const navigate = useNavigate();

  async function onSubmit(data: AddPartyInput) {
    try {
      const created = await mutateAsync({ data });
      if (created) {
        navigate(`/app/parties/${created.id}`);
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
        title="Add a party"
        variant={variant}
        onClick={modal.open}
      />
      <PartyModal onSubmit={onSubmit} open={open} setOpen={modal.set} />
    </>
  );
}

interface AddPartyButtonProps {
  variant?: FlexButtonVariant;
}
