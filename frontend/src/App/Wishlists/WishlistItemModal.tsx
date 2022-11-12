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

export default function WishlistItemModal(props: WishlistItemModalProps) {
  const { open, setOpen, initialValues, onSubmit: userOnSubmit } = props;
  const { handleSubmit, register } = useForm<WishlistItemFormValues>({
    defaultValues: initialValues,
  });

  function onSubmit(values: WishlistItemFormValues) {
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

interface WishlistItemModalProps {
  open: boolean;
  setOpen: (state: boolean) => void;
  initialValues?: WishlistItemFormValues;
  onSubmit: (values: WishlistItemFormValues) => void;
}

export interface WishlistItemFormValues {
  name: string;
  url?: string;
  quantity?: number;
}
