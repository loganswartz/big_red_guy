import { EditIcon } from "@chakra-ui/icons";
import { useToast } from "@chakra-ui/react";
import PartyModal from "./PartyModal";
import useEditParty, {
  EditPartyInput,
} from "../../../Global/Api/Mutations/Parties/useEditParty";
import { Party } from "../../../Global/Api/Types/Api";
import useModalState from "../../../Global/Helpers/ModalHelper";
import FlexButton, { FlexButtonVariant } from "../../../Components/FlexButton";

export default function EditPartyButton(props: EditPartyButtonProps) {
  const { party, refetch, variant } = props;

  const [open, modal] = useModalState();
  const { mutateAsync } = useEditParty(party.id);
  const toast = useToast();

  async function onSubmit(data: EditPartyInput) {
    await mutateAsync({ data });
    refetch?.();
    toast({
      description: `Successfully updated party!`,
    });
  }

  return (
    <>
      <FlexButton
        title="Edit party"
        icon={<EditIcon />}
        onClick={modal.open}
        variant={variant}
      />
      <PartyModal
        title="Edit Party"
        initialValues={party}
        onSubmit={onSubmit}
        open={open}
        setOpen={modal.set}
      />
    </>
  );
}

interface EditPartyButtonProps {
  party: Party;
  refetch?: () => void;
  variant?: FlexButtonVariant;
}
