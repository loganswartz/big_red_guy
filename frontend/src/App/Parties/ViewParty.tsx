import {
  Center,
  Divider,
  Heading,
  HStack,
  IconButton,
  List,
  ListItem,
  Text,
  VStack,
} from "@chakra-ui/react";
import Card from "../../Components/Card";
import { useParams } from "react-router-dom";
import useParty from "../../Global/Api/Queries/Parties/useParty";
import Loading from "../../Components/Loading";
import EditPartyButton from "./Components/EditPartyButton";
import AssignWishlistButton from "./Components/AssignWishlistButton";
import usePartyLists from "../../Global/Api/Queries/Parties/usePartyLists";
import { SettingsIcon } from "@chakra-ui/icons";
import useModalState from "../../Global/Helpers/ModalHelper";
import AssignPartyMembersModal from "./Components/AssignPartyMembersModal";
import useCurrentUser from "../../Global/Api/Queries/useCurrentUser";
import usePartyMembers from "../../Global/Api/Queries/Parties/usePartyMembers";
import { User, Wishlist } from "../../Global/Api/Types/Api";

export default function ViewParty() {
  const { id = "" } = useParams<{ id: string }>();

  const [open, modal] = useModalState();
  const { data: me } = useCurrentUser();
  const { data: party, isInitialLoading, refetch } = useParty(id);
  const { data: lists } = usePartyLists(id);
  const { data: users } = usePartyMembers(id);

  if (isInitialLoading) {
    return <Loading />;
  } else if (!party) {
    return <>Party not found.</>;
  }

  const wishlists = lists ?? [];
  const members = users ?? [];
  const memberLists = members.map(
    (user) =>
      [user, wishlists.filter((list) => list.owner_id === user.id)] as [
        User,
        Wishlist[]
      ]
  );

  return (
    <Card>
      <VStack spacing={4}>
        <Center>
          <VStack>
            <HStack spacing={2}>
              <Heading>{party.name}</Heading>
              {party.owner_id === me?.id ? (
                <EditPartyButton
                  party={party}
                  refetch={refetch}
                  variant="icon"
                />
              ) : null}
              <IconButton
                icon={<SettingsIcon />}
                aria-label="Party settings"
                onClick={modal.open}
              />
            </HStack>
            <HStack spacing={2}>
              <AssignWishlistButton party={party} variant="hybrid" />
            </HStack>
          </VStack>
        </Center>
        <Divider />
        <HStack spacing={3}>
          {memberLists.map(([user, lists]) => (
            <Card>
              <VStack spacing={2}>
                <Center>{user.name}</Center>
                <List>
                  {lists.map((list) => (
                    <ListItem>
                      <HStack>
                        <Text>{list.name}</Text>
                      </HStack>
                    </ListItem>
                  ))}
                </List>
              </VStack>
            </Card>
          ))}
        </HStack>
      </VStack>
      <AssignPartyMembersModal party={party} open={open} setOpen={modal.set} />
    </Card>
  );
}
