import { Center, Heading, HStack, VStack } from "@chakra-ui/react";
import Card from "../../Components/Card";

export default function CreateWishlist() {
  return (
    <Card>
      <VStack>
        <Center>
          <Heading>Create a Wishlist</Heading>
        </Center>
        <HStack>
          <label htmlFor="name">Name:&nbsp;&nbsp;&nbsp;</label>
          <input name="name" />
        </HStack>
        <Center>
          <input type="submit" value="Create" />
        </Center>
      </VStack>
    </Card>
  );
}
