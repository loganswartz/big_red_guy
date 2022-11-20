import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  VStack,
} from "@chakra-ui/react";
import { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { AddPartyInput } from "../../../Global/Api/Mutations/Parties/useAddParty";

export default function PartyModal(props: PartyModalProps) {
  const {
    open,
    setOpen,
    onSubmit: userOnSubmit,
    initialValues,
    title = "Create a Party",
  } = props;

  const { handleSubmit, register, reset } = useForm<AddPartyInput>({
    defaultValues: initialValues,
  });

  function onSubmit(values: AddPartyInput) {
    setOpen(false);
    userOnSubmit(values);
    reset();
  }

  return (
    <Modal isOpen={open} onClose={() => setOpen(false)}>
      <ModalOverlay />
      <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader>{title}</ModalHeader>
        <ModalBody>
          <VStack>
            <Input placeholder="Name" {...register("name")} />
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setOpen(false)} mr={3}>
            Cancel
          </Button>
          <Button type="submit" colorScheme="blue">
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

interface PartyModalProps {
  open: boolean;
  setOpen: (state: boolean) => void;
  initialValues?: AddPartyInput;
  title?: ReactNode;
  onSubmit: (values: AddPartyInput) => void;
}
