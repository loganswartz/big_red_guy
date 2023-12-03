import { Avatar, HStack } from "@chakra-ui/react";
import { CurrentUserAvatar } from "./UserAvatar";
import useModalState from "../../Global/Helpers/ModalHelper";
import BigRedGuy from "../../Components/BigRedGuy";
import { SettingsModal } from "./SettingsModal";

export default function Appbar(props: AppbarProps) {
  const [settingsOpen, settings] = useModalState();

  return (
    <>
      <HStack p={2} justifyContent="space-between" width="100%">
        <Avatar opacity={0} />
        <BigRedGuy />
        <CurrentUserAvatar onClick={settings.open} />
      </HStack>
      <SettingsModal open={settingsOpen} setOpen={settings.set} />
    </>
  );
}

interface AppbarProps {}
