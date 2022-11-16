import {
  Button,
  HStack,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import useAssignListToParty from "../../../Global/Api/Mutations/Parties/useAssignListToParty";
import usePartyLists from "../../../Global/Api/Queries/Parties/usePartyLists";
import useAllWishlists from "../../../Global/Api/Queries/Wishlists/useAllWishlists";
import { Party } from "../../../Global/Api/Types/Api";
import { ID } from "../../../Global/Api/Types/Utility";

export default function AssignWishlistModal(props: AssignWishlistModalProps) {
  const {
    party,
    title = `Assign list to ${party.name}`,
    open,
    setOpen,
  } = props;

  const { data: allLists } = useAllWishlists();
  const { data: partyLists, refetch } = usePartyLists(party.id);
  const { mutateAsync } = useAssignListToParty();

  function listIsAssignedToParty(listId: ID) {
    return (partyLists ?? []).some((list) => list.id === listId);
  }

  async function toggleAssignment(listId: ID) {
    const method = listIsAssignedToParty(listId) ? "DELETE" : "PUT";
    await mutateAsync({ path: [{ partyId: party.id, listId }], method });
    await refetch();
  }

  const wishlists = allLists ?? [];

  return (
    <Modal isOpen={open} onClose={() => setOpen(false)}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalBody>
          <List spacing={1}>
            {wishlists.length === 0 ? (
              <ListItem>No lists found.</ListItem>
            ) : (
              wishlists.map((list) => {
                const assigned = listIsAssignedToParty(list.id);
                return (
                  <ListItem>
                    <HStack justifyContent="space-around">
                      <Text fontSize="lg">{list.name}</Text>
                      <Button
                        color={assigned ? "cyan" : "red.400"}
                        onClick={() => toggleAssignment(list.id)}
                      >
                        {assigned ? "Unassign" : "Assign"}
                      </Button>
                    </HStack>
                  </ListItem>
                );
              })
            )}
          </List>
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

interface AssignWishlistModalProps {
  party: Party;
  open: boolean;
  setOpen: (state: boolean) => void;
  title?: string;
}
