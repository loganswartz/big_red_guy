import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  VStack,
  Input,
  NumberInput,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";

export default function AddWishlistItemModal(props: AddWishlistItemModalProps) {
  const { open, setOpen, onSubmit: userOnSubmit } = props;
  const { handleSubmit, register } = useForm<AddWishlistItemFormValues>();

  function onSubmit(values: AddWishlistItemFormValues) {
    setOpen(false);
    userOnSubmit(values);
  }

  return (
    <Modal isOpen={open} onClose={() => setOpen(false)}>
      <ModalOverlay />
      <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader>Add an Item</ModalHeader>
        <ModalBody>
          <VStack>
            <Input placeholder="Name" {...register("name")} />
            <Input placeholder="Link" {...register("link")} />
            <NumberInput>
              <NumberInputField
                placeholder="How many?"
                {...register("quantity")}
              />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setOpen(false)} mr={3}>
            Cancel
          </Button>
          <Button type="submit" colorScheme="blue">
            Add
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

interface AddWishlistItemModalProps {
  open: boolean;
  setOpen: (state: boolean) => void;
  onSubmit: (values: AddWishlistItemFormValues) => void;
}

export interface AddWishlistItemFormValues {
  name: string;
  link?: string;
  quantity?: number;
}
