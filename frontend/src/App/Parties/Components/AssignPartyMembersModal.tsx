import { AddIcon, MinusIcon, StarIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  Divider,
  HStack,
  IconButton,
  Input,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import useAddPartyMemberByEmail from "../../../Global/Api/Mutations/Parties/useAddPartyMemberByEmail";
import useAssignPartyMember from "../../../Global/Api/Mutations/Parties/useAssignPartyMember";
import usePartyMembers from "../../../Global/Api/Queries/Parties/usePartyMembers";
import useCurrentUser from "../../../Global/Api/Queries/useCurrentUser";
import { Party } from "../../../Global/Api/Types/Api";
import { ID } from "../../../Global/Api/Types/Utility";
import { UserAvatar } from "../../Components/UserAvatar";

export default function AssignPartyMembersModal(
  props: AssignPartyMembersModalProps
) {
  const { party, title = `Members of ${party.name}`, open, setOpen } = props;

  const toast = useToast();
  const { handleSubmit, register, reset } = useForm<AddUserFormValues>();
  const { data: me } = useCurrentUser();
  const { data: allMembers, refetch } = usePartyMembers(party.id);
  const { mutateAsync: removeUser } = useAssignPartyMember();
  const { mutateAsync: addUser } = useAddPartyMemberByEmail(party.id);

  async function removeMember(userId: ID) {
    try {
      await removeUser({
        path: [{ partyId: party.id, userId }],
        method: "DELETE",
      });
      toast({ status: "success", title: "Removed user!" });
      await refetch();
    } catch (e: any) {
      toast({ status: "error", title: "Error", description: e.message });
    }
  }

  async function addMember(data: AddUserFormValues) {
    try {
      await addUser({ data });
      toast({ status: "success", title: "Added user!" });
      await refetch();
    } catch (e: any) {
      toast({ status: "error", title: "Error", description: e.message });
    } finally {
      reset();
    }
  }

  function userIsOwner(userId?: number) {
    return party && party.owner_id === userId;
  }
  const members = allMembers ?? [];
  const canEdit = userIsOwner(me?.id);

  return (
    <Modal isOpen={open} onClose={() => setOpen(false)}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Center>{title}</Center>
        </ModalHeader>
        <ModalBody>
          <VStack spacing={3}>
            {canEdit ? (
              <HStack as="form" onSubmit={handleSubmit(addMember)} spacing={2}>
                <Input placeholder="Email" {...register("email")} />
                <IconButton
                  icon={<AddIcon />}
                  aria-label="Add user"
                  type="submit"
                />
              </HStack>
            ) : null}
            <Divider />
            <List width="100%" spacing={2}>
              {members.length === 0 ? (
                <ListItem>No members found.</ListItem>
              ) : (
                members.map((user) => (
                  <ListItem key={user.id}>
                    <HStack>
                      <Text fontSize="lg" flexGrow={1}>
                        <Center>
                          <HStack spacing={1} alignItems="center">
                            {userIsOwner(user.id) ? <StarIcon /> : null}
                            <UserAvatar user={user} size="sm" />
                            <Box>{user.name}</Box>
                          </HStack>
                        </Center>
                      </Text>
                      {canEdit ? (
                        <IconButton
                          onClick={() => removeMember(user.id)}
                          disabled={userIsOwner(user.id)}
                          icon={<MinusIcon />}
                          aria-label="Remove this user"
                        />
                      ) : null}
                    </HStack>
                  </ListItem>
                ))
              )}
            </List>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => setOpen(false)} colorScheme="blue">
            Done
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

interface AssignPartyMembersModalProps {
  party: Party;
  open: boolean;
  setOpen: (state: boolean) => void;
  title?: string;
}

interface AddUserFormValues {
  email: string;
}
