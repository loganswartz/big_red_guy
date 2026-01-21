import { Heading, HStack, Image } from "@chakra-ui/react";
import React, { ComponentProps } from "react";

const BigRedGuy = React.forwardRef(
  (props: ComponentProps<typeof HStack>, ref) => {
    return (
      <HStack ref={ref} alignItems="center" {...props}>
        <Image src="/android-chrome-512x512.png" boxSize="2rem" />
        <Heading>
          Big<span style={{ color: "red" }}>Red</span>Guy
        </Heading>
      </HStack>
    );
  },
);

export default BigRedGuy;
