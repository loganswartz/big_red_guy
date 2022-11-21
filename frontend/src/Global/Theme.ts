import { extendTheme, StyleConfig, type ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: true,
};

const components: Record<string, StyleConfig> = {
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
};

const theme = extendTheme({
  config,
  components,
});

export default theme;
