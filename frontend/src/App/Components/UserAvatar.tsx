import { Avatar, AvatarProps } from "@chakra-ui/react";
import useCurrentUser from "../../Global/Api/Queries/useCurrentUser";
import { User } from "../../Global/Api/Types/Api";
import useModalState from "../../Global/Helpers/ModalHelper";
import { SetProfilePictureModal } from "./SetProfilePictureModal";

export function UserAvatar(props: UserAvatarProps) {
  const { user, ...other } = props;
  const url = user?.profile_picture
    ? `/uploads/${user.profile_picture}`
    : undefined;

  return <Avatar name={user?.name} src={url} userSelect="none" {...other} />;
}

interface UserAvatarProps extends Omit<AvatarProps, "src" | "name"> {
  user?: User | null;
}

export function CurrentUserAvatar(
  props: Omit<UserAvatarProps, "user" | "onClick">
) {
  const [open, modal] = useModalState();
  const { data } = useCurrentUser();

  return (
    <>
      <UserAvatar
        user={data}
        onClick={modal.open}
        _hover={{ cursor: "pointer" }}
        {...props}
      />
      <SetProfilePictureModal open={open} setOpen={modal.set} />
    </>
  );
}
