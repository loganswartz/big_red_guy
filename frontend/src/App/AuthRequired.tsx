import {
  ButtonGroup,
  Container,
  HStack,
  Icon,
  StackProps,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link as ReactRouterLink, Outlet } from "react-router-dom";
import Appbar from "./Components/Appbar";
import useCurrentUser from "../Global/Api/Queries/useCurrentUser";
import { SettingsIcon } from "@chakra-ui/icons";
import { RiFileList3Fill } from "react-icons/ri";
import { GiPartyPopper } from "react-icons/gi";
import { TiHome } from "react-icons/ti";
import FlexButton, { FlexButtonProps } from "../Components/FlexButton";

export default function AuthRequired() {
  // ensure the user is logged in
  // if not, using this hook will cause a redirect to the login page
  useCurrentUser();

  return (
    <>
      <Appbar />
      <Container
        padding={2}
        maxW="100%"
        flexGrow={1}
        justifyContent="center"
        centerContent
      >
        <Outlet />
      </Container>
      <NavBar />
    </>
  );
}

function NavBar(props: StackProps) {
  const breakpoints: FlexButtonProps["breakpoints"] = {
    sm: "icon",
    md: "hybrid",
  };

  const buttonBg = useColorModeValue("gray.200", "gray.700");
  const buttonBgHover = useColorModeValue("gray.300", "gray.600");
  const buttonBorder = useColorModeValue("blackAlpha.300", "whiteAlpha.300");

  const commonProps: Partial<FlexButtonProps> = {
    background: buttonBg,
    size: "lg",
    breakpoints,
    as: ReactRouterLink,
    _hover: { background: buttonBgHover },
  };

  return (
    <HStack
      position="sticky"
      bottom="calc(env(safe-area-inset-bottom) + var(--chakra-space-5))"
      {...props}
    >
      <ButtonGroup
        isAttached
        borderRadius={8}
        borderColor={buttonBorder}
        borderWidth={2}
      >
        <FlexButton
          title="Home"
          icon={<Icon as={TiHome} />}
          iconSide="left"
          to="/app"
          {...commonProps}
        />
        <FlexButton
          title="Parties"
          icon={<Icon as={GiPartyPopper} />}
          iconSide="left"
          to="/app/parties"
          {...commonProps}
        />
        <FlexButton
          title="Lists"
          icon={<Icon as={RiFileList3Fill} />}
          iconSide="left"
          to="/app/wishlists"
          {...commonProps}
        />
        <FlexButton
          title="Settings"
          icon={<SettingsIcon />}
          iconSide="left"
          to="/app/settings"
          {...commonProps}
        />
      </ButtonGroup>
    </HStack>
  );
}
