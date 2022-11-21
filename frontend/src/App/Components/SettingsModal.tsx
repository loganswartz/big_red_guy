import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import DarkmodeToggle from "../../Components/DarkmodeToggle";

export function SettingsModal(props: SettingsModalProps) {
  const { open, setOpen } = props;

  return (
    <Modal isOpen={open} onClose={() => setOpen(false)}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Settings</ModalHeader>
        <ModalBody>
          <DarkmodeToggle />
        </ModalBody>
        <ModalFooter>
          <HStack spacing={1}>
            <Button
              colorScheme="blue"
              onClick={() => {
                setOpen(false);
              }}
            >
              Done
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

interface SettingsModalProps {
  open: boolean;
  setOpen: (state: boolean) => void;
}
