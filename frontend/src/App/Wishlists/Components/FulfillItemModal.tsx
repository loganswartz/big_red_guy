import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  VStack,
  NumberInput,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInputField,
  NumberInputStepper,
  Textarea,
  HStack,
  Box,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { FulfillItemInput } from "../../../Global/Api/Mutations/Fulfillments/useFulfillItem";

export default function FulfillItemModal(props: FulfillItemModalProps) {
  const {
    open,
    setOpen,
    initialValues,
    title = "Fulfill an item",
    submitName = "Fulfill",
    onSubmit: userOnSubmit,
    onCancel: userOnCancel,
  } = props;
  const { handleSubmit, register, reset } = useForm<FulfillItemFormValues>({
    defaultValues: { quantity: 1, ...initialValues },
  });

  function onSubmit(values: FulfillItemFormValues) {
    setOpen(false);
    userOnSubmit(values);
    reset();
  }

  function onCancel() {
    reset();
    setOpen(false);
    userOnCancel?.();
  }

  return (
    <Modal isOpen={open} onClose={onCancel}>
      <ModalOverlay />
      <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader>{title}</ModalHeader>
        <ModalBody>
          <VStack>
            <HStack spacing={4}>
              <Box>Quantity:</Box>
              <NumberInput precision={0}>
                <NumberInputField
                  placeholder="How Many?"
                  {...register("quantity", {
                    valueAsNumber: true,
                  })}
                />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </HStack>
            <Textarea placeholder="Notes" {...register("notes")} />
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

interface FulfillItemModalProps {
  open: boolean;
  setOpen: (state: boolean) => void;
  initialValues?: FulfillItemFormValues;
  onSubmit: (values: FulfillItemFormValues) => void;
  onCancel?: () => void;
  title?: string;
  submitName?: string;
}

export interface FulfillItemFormValues
  extends Omit<FulfillItemInput, "wishlist_item_id"> {}
