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
    baseStyle: ({ colorMode }) => ({
      bg: colorMode === "dark" ? "gray.700" : "white",
      borderColor: colorMode === "dark" ? "gray.600" : "gray.200",
    }),
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
