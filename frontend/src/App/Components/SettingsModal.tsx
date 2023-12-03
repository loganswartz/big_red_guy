import {
  Button,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  VStack,
  Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import useLogout from "../../Global/Api/Mutations/useLogout";
import useCurrentUser from "../../Global/Api/Queries/useCurrentUser";
import { CurrentUserAvatar } from "./UserAvatar";

export function SettingsModal(props: SettingsModalProps) {
  const { open, setOpen } = props;
  const { data: me } = useCurrentUser();
  const logout = useLogout();
  const navigate = useNavigate();

  return (
    <Modal isOpen={open} onClose={() => setOpen(false)}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <VStack justifyContent="center">
            <CurrentUserAvatar />
            <Text>{me?.name}</Text>
          </VStack>
        </ModalHeader>
        <ModalFooter>
          <VStack width="100%" justifyContent="center">
            <Button
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              Log Out
            </Button>
          </VStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

interface SettingsModalProps {
  open: boolean;
  setOpen: (state: boolean) => void;
}
