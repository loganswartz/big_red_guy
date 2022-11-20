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
  Textarea,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { EditWishlistItemInput } from "../../../Global/Api/Mutations/Wishlists/useEditWishlistItem";

export default function WishlistItemModal(props: WishlistItemModalProps) {
  const { open, setOpen, initialValues, onSubmit: userOnSubmit } = props;
  const { handleSubmit, register } = useForm<EditWishlistItemInput>({
    defaultValues: initialValues,
  });

  function onSubmit(values: EditWishlistItemInput) {
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
            <Input placeholder="Link" {...register("url")} />
            <Textarea placeholder="Notes" {...register("notes")} />
            <NumberInput precision={0}>
              <NumberInputField
                placeholder="How many?"
                {...register("quantity", {
                  valueAsNumber: true,
                })}
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

interface WishlistItemModalProps {
  open: boolean;
  setOpen: (state: boolean) => void;
  initialValues?: EditWishlistItemInput;
  onSubmit: (values: EditWishlistItemInput) => void;
}
