import { Box, Button, Heading, Input, VStack } from "@chakra-ui/react";
import BigRedGuy from "../Components/BigRedGuy";
import Card from "../Components/Card";
import ContentInMiddle from "../Components/ContentInMiddle";

export default function Register() {
  return (
    <ContentInMiddle>
      <Card>
        <VStack spacing={4}>
          <BigRedGuy />
          <Box>
            <form method="post">
              <VStack>
                <Heading size="md">Create an account:</Heading>
                <Input placeholder="Email" name="email" />
                <Input type="password" placeholder="Password" name="password" />
                <Input
                  type="password"
                  placeholder="Confirm password"
                  name="confirm-password"
                />
                <Button type="submit">Register</Button>
              </VStack>
            </form>
          </Box>
        </VStack>
      </Card>
    </ContentInMiddle>
  );
}
