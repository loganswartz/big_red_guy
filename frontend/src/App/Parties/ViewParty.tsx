import { Center, Divider, Heading, HStack, VStack } from "@chakra-ui/react";
import Card from "../../Components/Card";
import { useParams } from "react-router-dom";
import useParty from "../../Global/Api/Queries/Parties/useParty";
import Loading from "../../Components/Loading";
import EditPartyButton from "./Components/EditPartyButton";

export default function ViewParty() {
  const { id = "" } = useParams<{ id: string }>();

  const { data: party, isInitialLoading, refetch } = useParty(id);

  if (isInitialLoading) {
    return <Loading />;
  } else if (!party) {
    return <>Party not found.</>;
  }

  return (
    <Card>
      <VStack spacing={4}>
        <Center>
          <HStack spacing={2}>
            <Heading>{party.name}</Heading>
            <EditPartyButton party={party} refetch={refetch} variant="icon" />
          </HStack>
        </Center>
        <Divider />
      </VStack>
    </Card>
  );
}
