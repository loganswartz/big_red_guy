import { HamburgerIcon } from "@chakra-ui/icons";
import {
  Button,
  Center,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  IconButton,
  Link,
  VStack,
} from "@chakra-ui/react";
import { Link as ReactRouterLink, useNavigate } from "react-router-dom";
import useLogout from "../Global/Api/Mutations/useLogout";
import useModalState from "../Global/Helpers/ModalHelper";
import BigRedGuy from "./BigRedGuy";

export default function Appbar(props: AppbarProps) {
  const { height = "3rem" } = props;

  const logout = useLogout();
  const navigate = useNavigate();
  const [open, drawer] = useModalState();

  return (
    <>
      <HStack
        p={2}
        justifyContent="space-between"
        sx={{ width: "100%", height }}
        bg="grey.100"
      >
        <IconButton
          aria-label="Open Drawer"
          icon={<HamburgerIcon />}
          onClick={drawer.open}
        />
      </HStack>
      <Drawer placement="left" onClose={drawer.close} isOpen={open}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">
            <Center>
              <BigRedGuy />
            </Center>
          </DrawerHeader>
          <DrawerBody>
            <VStack justifyContent="space-between">
              <VStack spacing={2}>
                <Link as={ReactRouterLink} to="/app" onClick={drawer.close}>
                  Home
                </Link>
                <Link
                  as={ReactRouterLink}
                  to="/app/wishlists"
                  onClick={drawer.close}
                >
                  Wishlists
                </Link>
              </VStack>
              <Button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
              >
                Log Out
              </Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

interface AppbarProps {
  height?: string;
}
