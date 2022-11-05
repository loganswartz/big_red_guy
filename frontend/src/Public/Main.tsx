import { Box, Button, HStack, VStack } from "@chakra-ui/react";
import { Link as ReactRouterLink } from "react-router-dom";
import BigRedGuy from "../Components/BigRedGuy";
import Card from "../Components/Card";
import ContentInMiddle from "../Components/ContentInMiddle";

export default function Main() {
  return (
    <ContentInMiddle>
      <Card>
        <VStack spacing={4}>
          <BigRedGuy />
          <Box>
            <VStack>
              <Box>A "Secret Santa" manager written in Rust.</Box>
              <HStack>
                <Button as={ReactRouterLink} to="/register">
                  Register
                </Button>
                <Button as={ReactRouterLink} to="/login">
                  Login
                </Button>
              </HStack>
            </VStack>
          </Box>
        </VStack>
      </Card>
    </ContentInMiddle>
  );
}
