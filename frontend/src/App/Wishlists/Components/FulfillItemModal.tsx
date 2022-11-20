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
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { FulfillItemInput } from "../../../Global/Api/Mutations/Fulfillments/useFulfillItem";

export default function FulfillItemModal(props: FulfillItemModalProps) {
  const {
    open,
    setOpen,
    title = "Fulfill an item",
    onSubmit: userOnSubmit,
  } = props;
  const { handleSubmit, register } = useForm<FulfillItemFormValues>({
    defaultValues: { quantity: 1 },
  });

  function onSubmit(values: FulfillItemFormValues) {
    setOpen(false);
    userOnSubmit(values);
  }

  return (
    <Modal isOpen={open} onClose={() => setOpen(false)}>
      <ModalOverlay />
      <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader>{title}</ModalHeader>
        <ModalBody>
          <VStack>
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
            Fulfill
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

interface FulfillItemModalProps {
  open: boolean;
  setOpen: (state: boolean) => void;
  onSubmit: (values: FulfillItemFormValues) => void;
  title?: string;
}

export interface FulfillItemFormValues
  extends Omit<FulfillItemInput, "wishlist_item_id"> {}
