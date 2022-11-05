import { Box, Button, VStack } from "@chakra-ui/react";
import { Link as ReactRouterLink } from "react-router-dom";
import Card from "../Components/Card";

export default function Home() {
  return (
    <Card>
      <VStack>
        <Box>Welcome!</Box>
        <Button as={ReactRouterLink} to="/wishlists">
          Go to Wishlists
        </Button>
      </VStack>
    </Card>
  );
}
