import {
  Button,
  Center,
  Divider,
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
  VStack,
} from "@chakra-ui/react";
import useAssignListToParty from "../../../Global/Api/Mutations/Parties/useAssignListToParty";
import usePartyLists from "../../../Global/Api/Queries/Parties/usePartyLists";
import useAllWishlists from "../../../Global/Api/Queries/Wishlists/useAllWishlists";
import { Party } from "../../../Global/Api/Types/Api";
import { ID } from "../../../Global/Api/Types/Utility";

export default function AssignWishlistModal(props: AssignWishlistModalProps) {
  const { party, title = `Wishlists for ${party.name}`, open, setOpen } = props;

  const { data: allLists } = useAllWishlists();
  const { data: partyLists, refetch } = usePartyLists(party.id);
  const { mutateAsync } = useAssignListToParty();

  function listIsAssignedToParty(listId: ID) {
    return (partyLists ?? []).some((list) => list.wishlist.id === listId);
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
        <ModalHeader>
          <Center>{title}</Center>
        </ModalHeader>
        <ModalBody>
          <VStack spacing={3}>
            <Text fontSize="lg">
              What lists should other people in this party to be able to see?
            </Text>
            <Divider />
            <List width="100%" spacing={2}>
              {wishlists.length === 0 ? (
                <ListItem>No lists found.</ListItem>
              ) : (
                wishlists.map((list) => {
                  const assigned = listIsAssignedToParty(list.id);
                  return (
                    <ListItem key={list.id}>
                      <HStack>
                        <Text fontSize="lg" flexGrow={1}>
                          <Center>{list.name}</Center>
                        </Text>
                        <Button
                          color={assigned ? "cyan" : "red.400"}
                          onClick={() => toggleAssignment(list.id)}
                        >
                          {assigned ? "Remove" : "Add"}
                        </Button>
                      </HStack>
                    </ListItem>
                  );
                })
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

interface AssignWishlistModalProps {
  party: Party;
  open: boolean;
  setOpen: (state: boolean) => void;
  title?: string;
}
