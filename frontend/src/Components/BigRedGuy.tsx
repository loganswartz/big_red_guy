import { Heading, HStack, StackProps, Image } from "@chakra-ui/react";

export default function BigRedGuy(props: StackProps) {
  return (
    <HStack alignItems="center" {...props}>
      <Image src="/android-chrome-512x512.png" boxSize="2rem" />
      <Heading>
        Big<span style={{ color: "red" }}>Red</span>Guy
      </Heading>
    </HStack>
  );
}
