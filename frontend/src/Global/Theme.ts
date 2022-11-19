import {
  extendTheme,
  StyleConfig,
  SystemStyleInterpolation,
  type ThemeConfig,
} from "@chakra-ui/react";

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

const styles: Record<string, SystemStyleInterpolation> = {
  global: ({ colorMode }) => ({
    body: {
      backgroundColor: colorMode === "dark" ? "gray.800" : "gray.100",
    },
  }),
};

const theme = extendTheme({
  config,
  components,
  styles,
});

export default theme;
