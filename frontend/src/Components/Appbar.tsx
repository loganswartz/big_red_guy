import { HamburgerIcon } from "@chakra-ui/icons";
import {
  Text,
  Button,
  Center,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  IconButton,
  Link,
  VStack,
} from "@chakra-ui/react";
import { Link as ReactRouterLink, useNavigate } from "react-router-dom";
import { CurrentUserAvatar } from "../App/Components/UserAvatar";
import useLogout from "../Global/Api/Mutations/useLogout";
import useCurrentUser from "../Global/Api/Queries/useCurrentUser";
import useModalState from "../Global/Helpers/ModalHelper";
import BigRedGuy from "./BigRedGuy";

export default function Appbar(props: AppbarProps) {
  const { height = "3rem" } = props;

  const { data: me } = useCurrentUser();
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
            <VStack spacing={2}>
              <Link as={ReactRouterLink} to="/app" onClick={drawer.close}>
                Home
              </Link>
              <Link
                as={ReactRouterLink}
                to="/app/parties"
                onClick={drawer.close}
              >
                Parties
              </Link>
              <Link
                as={ReactRouterLink}
                to="/app/wishlists"
                onClick={drawer.close}
              >
                Wishlists
              </Link>
            </VStack>
          </DrawerBody>
          <DrawerFooter>
            <VStack sx={{ width: "100%" }}>
              <HStack justifyContent="space-between">
                <CurrentUserAvatar />
                <Text>{me?.name}</Text>
              </HStack>
              <Button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
              >
                Log Out
              </Button>
            </VStack>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}

interface AppbarProps {
  height?: string;
}
