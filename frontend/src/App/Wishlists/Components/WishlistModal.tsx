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
import { AddWishlistInput } from "../../../Global/Api/Mutations/Wishlists/useCreateWishlist";

export default function WishlistModal(props: WishlistModalProps) {
  const {
    open,
    setOpen,
    onSubmit: userOnSubmit,
    initialValues,
    title = "Create a Wishlist",
  } = props;

  const { handleSubmit, register, reset } = useForm<AddWishlistInput>({
    defaultValues: initialValues,
  });

  function onSubmit(values: AddWishlistInput) {
    setOpen(false);
    userOnSubmit(values);
  }

  return (
    <Modal
      isOpen={open}
      onClose={() => {
        reset();
        setOpen(false);
      }}
    >
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

interface WishlistModalProps {
  open: boolean;
  setOpen: (state: boolean) => void;
  initialValues?: AddWishlistInput;
  title?: ReactNode;
  onSubmit: (values: AddWishlistInput) => void;
}
