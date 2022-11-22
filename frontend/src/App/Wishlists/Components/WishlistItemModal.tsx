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
  Text,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { EditWishlistItemInput } from "../../../Global/Api/Mutations/Wishlists/useEditWishlistItem";

export default function WishlistItemModal(props: WishlistItemModalProps) {
  const {
    open,
    setOpen,
    initialValues,
    title = "Add an Item",
    submitName = "Add",
    onSubmit: userOnSubmit,
  } = props;

  const { handleSubmit, register, reset } = useForm<EditWishlistItemInput>({
    defaultValues: { quantity: 1, ...initialValues },
  });

  function onSubmit(values: EditWishlistItemInput) {
    setOpen(false);
    userOnSubmit(values);
    reset();
  }

  function onCancel() {
    reset();
    setOpen(false);
  }

  return (
    <Modal isOpen={open} onClose={onCancel}>
      <ModalOverlay />
      <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader>{title}</ModalHeader>
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
            <Text color="gray.500" fontSize="xs">
              Tip: You can delete the number out of the "How Many?" field above
              to indicate that people can get you as many of this item as they
              want.
            </Text>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={onCancel} mr={3}>
            Cancel
          </Button>
          <Button type="submit" colorScheme="blue">
            {submitName}
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
  title?: string;
  submitName?: string;
}
