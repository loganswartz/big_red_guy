import { Heading, HStack, Image } from "@chakra-ui/react";

export default function BigRedGuy() {
  return (
    <HStack spacing={2}>
      <Image src="/android-chrome-512x512.png" boxSize="2rem" />
      <Heading>
        Big<span style={{ color: "red" }}>Red</span>Guy
      </Heading>
    </HStack>
  );
}
