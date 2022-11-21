import {
  Button,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import usePfp from "../../Global/Api/Mutations/usePfp";
import useCurrentUser from "../../Global/Api/Queries/useCurrentUser";

export function SetProfilePictureModal(props: SetProfilePictureModalProps) {
  const { open, setOpen } = props;

  const { register, handleSubmit, reset } = useForm<PfpForm>();
  const toast = useToast();

  const { refetch } = useCurrentUser();
  const { mutateAsync } = usePfp();

  async function onSubmit(data: PfpForm) {
    console.log(data);
    const file = data.files.item(0) ?? null;
    if (!file) {
      return;
    }

    const body = new FormData();
    body.append("file", file, file.name);

    try {
      await mutateAsync({ body });

      refetch();
      setOpen(false);
      toast({ status: "success", title: "Updated profile picture!" });
    } catch (e: any) {
      toast({ status: "error", title: "Failed to upload file." });
    }
  }

  return (
    <Modal isOpen={open} onClose={() => setOpen(false)}>
      <ModalOverlay />
      <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader>Upload a picture</ModalHeader>
        <ModalBody>
          <Input
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            {...register("files")}
          />
        </ModalBody>
        <ModalFooter>
          <HStack spacing={1}>
            <Button
              onClick={() => {
                setOpen(false);
                reset();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" colorScheme="blue">
              Save
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export interface SetProfilePictureModalProps {
  open: boolean;
  setOpen: (state: boolean) => void;
}

export interface PfpForm {
  files: FileList;
}
