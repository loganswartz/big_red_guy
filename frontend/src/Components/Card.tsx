import { PropsWithChildren } from "react";
import { Box, BoxProps, useStyleConfig } from "@chakra-ui/react";

export default function Card(props: PropsWithChildren<BoxProps>) {
  const { children, ...other } = props;
  const styles = useStyleConfig("Card");

  return (
    <Box
      __css={styles}
      maxW="sm"
      borderWidth={1}
      borderRadius="lg"
      overflow="hidden"
      p={6}
      {...other}
    >
      {children}
    </Box>
  );
}
