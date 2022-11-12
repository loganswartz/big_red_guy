import { EditIcon } from "@chakra-ui/icons";
import { IconButtonProps, IconButton } from "@chakra-ui/react";

export default function EditButton(
  props: Omit<IconButtonProps, "aria-label" | "icon">
) {
  return <IconButton aria-label="Edit Item" icon={<EditIcon />} {...props} />;
}
