import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Button,
  HStack,
} from "@chakra-ui/react";
import { PropsWithChildren } from "react";

export default function ConfirmationModal(props: ConfirmationModalProps) {
  const {
    open,
    setOpen,
    title = "Confirm?",
    onConfirm,
    onCancel,
    children,
  } = props;

  return (
    <Modal isOpen={open} onClose={() => setOpen(false)}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{children}</ModalBody>
        <ModalFooter>
          <HStack spacing={2}>
            <Button
              onClick={() => {
                setOpen(false);
                onCancel?.();
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setOpen(false);
                onConfirm?.();
              }}
              colorScheme="blue"
            >
              Confirm
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

interface ConfirmationModalProps extends PropsWithChildren<{}> {
  open: boolean;
  setOpen: (state: boolean) => void;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void | Promise<void>;
  title?: string;
}
