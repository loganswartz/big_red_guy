import { Box, Button, VStack } from "@chakra-ui/react";
import { Link as ReactRouterLink } from "react-router-dom";
import Card from "../Components/Card";
import useCurrentUser from "../Global/Api/Queries/useCurrentUser";

export default function Home() {
  const { data, status } = useCurrentUser();

  if (status === "loading") {
    return <>Loading...</>;
  } else if (!data) {
    return <>Something went wrong</>;
  }

  return (
    <Card>
      <VStack>
        <Box>Welcome, {data.name}!</Box>
        <Button as={ReactRouterLink} to="/app/parties">
          Go to Parties
        </Button>
        <Button as={ReactRouterLink} to="/app/wishlists">
          Go to Wishlists
        </Button>
      </VStack>
    </Card>
  );
}
