import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  Divider,
  Heading,
  HStack,
  IconButton,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { SettingsIcon } from "@chakra-ui/icons";
import { useParams } from "react-router-dom";
import useParty from "../../Global/Api/Queries/Parties/useParty";
import Loading from "../../Components/Loading";
import EditPartyButton from "./Components/EditPartyButton";
import AssignWishlistButton from "./Components/AssignWishlistButton";
import usePartyLists from "../../Global/Api/Queries/Parties/usePartyLists";
import useModalState from "../../Global/Helpers/ModalHelper";
import AssignPartyMembersModal from "./Components/AssignPartyMembersModal";
import useCurrentUser from "../../Global/Api/Queries/useCurrentUser";
import usePartyMembers from "../../Global/Api/Queries/Parties/usePartyMembers";
import {
  Fulfillment,
  User,
  WishlistWithItems,
} from "../../Global/Api/Types/Api";
import { UserAvatar } from "../Components/UserAvatar";
import { ListsAccordion } from "./Components/ListsAccordion";
import usePartyFulfillments from "../../Global/Api/Queries/Parties/usePartyFulfillments";
import { groupFulfillments } from "../../Global/Helpers/FulfillmentHelpers";

export default function ViewParty() {
  const { id = "" } = useParams<{ id: string }>();

  const [open, modal] = useModalState();
  const { data: me } = useCurrentUser();
  const { data: party, isInitialLoading, refetch: refetchParty } = useParty(id);
  const { data: lists, refetch: refetchLists } = usePartyLists(id);
  const { data: users } = usePartyMembers(id);
  const { data: fulfillments } = usePartyFulfillments(id);

  if (isInitialLoading) {
    return <Loading />;
  } else if (!party) {
    return <>Party not found.</>;
  }

  const wishlists = lists ?? [];
  const members = users ?? [];
  const memberLists = members.map(
    (user) =>
      [
        user,
        wishlists.filter((list) => list.wishlist.owner_id === user.id),
      ] as [User, WishlistWithItems[]]
  );

  const groupedFulfillments = groupFulfillments(fulfillments ?? []);

  return (
    <Card minWidth="sm">
      <CardHeader>
        <Center>
          <VStack>
            <HStack spacing={2}>
              <Heading>{party.name}</Heading>
              {party.owner_id === me?.id ? (
                <EditPartyButton
                  party={party}
                  refetch={refetchParty}
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
      </CardHeader>
      <Divider />
      <CardBody>
        <SimpleGrid minChildWidth="220px" spacing={3}>
          {memberLists.map(([user, lists]) => (
            <Card variant="outline">
              <CardHeader>
                <HStack spacing={2}>
                  <UserAvatar user={user} size="sm" />
                  <Text size="md">{user.name}</Text>
                </HStack>
              </CardHeader>
              <CardBody>
                {lists.length === 0 ? (
                  <Center>
                    <i>{user.name} hasn't added any lists yet.</i>
                  </Center>
                ) : (
                  <ListsAccordion
                    user={user}
                    lists={lists}
                    fulfillments={groupedFulfillments}
                    refetch={refetchLists}
                  />
                )}
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      </CardBody>
      <CardFooter>
        <AssignPartyMembersModal
          party={party}
          open={open}
          setOpen={modal.set}
        />
      </CardFooter>
    </Card>
  );
}
