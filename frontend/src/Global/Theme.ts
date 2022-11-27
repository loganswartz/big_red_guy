import { extendTheme } from "@chakra-ui/react";
import { modalAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/styled-system";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(modalAnatomy.keys);

const baseStyle = definePartsStyle({
  dialogContainer: {
    p: 4,
  },
});

export const modalTheme = defineMultiStyleConfig({
  baseStyle,
});

const theme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: true,
  },
  components: {
    Card: {
      defaultProps: {
        size: "sm",
      },
    },
    Button: {
      defaultProps: {
        size: "sm",
      },
    },
    Modal: modalTheme,
  },
});

export default theme;
