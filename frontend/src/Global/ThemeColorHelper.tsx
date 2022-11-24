import {
  pseudoSelectors,
  useColorModeValue,
  useTheme,
} from "@chakra-ui/system";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";

const META_NAME = "theme-color";
const APPLE_META_NAME = "apple-mobile-web-app-status-bar-style";

function getCssValue(property: string) {
  return window.getComputedStyle(document.body).getPropertyValue(property);
}

/**
 * Automatically change the color of the device status bar to match the app
 * topbar, when this app is installed as a standalone PWA.
 */
function ThemeColorHelper() {
  const [color, setColor] = useState<string>();

  // Extract the color value from the theme
  // I really wish Chakra exposed the values easily in the theme object like MUI
  const theme = useTheme();
  const selector = useColorModeValue(
    pseudoSelectors._light,
    pseudoSelectors._dark
  );
  const value = theme.__cssVars[selector]["--chakra-colors-chakra-body-bg"];
  // remove the surrounding var(...)
  const regex = /^var\((.+)\)$/;
  const match = value.match(regex);
  const property = match[1] ?? match.input;

  /**
   * For some reason, the CSS variable containing the body styles aren't
   * immediately available, so we have to use this effect to set the color
   * after they've loaded.
   */
  useEffect(() => {
    const found = getCssValue(property);

    if (found && color !== found) {
      setColor(found);
    }
  }, [property, color, setColor]);

  // Apple is weird, and sometimes this still doesn't work.
  const apple_color = "black-translucent";

  return (
    <Helmet>
      <meta name={META_NAME} content={color} />
      <meta name={APPLE_META_NAME} content={apple_color} />
    </Helmet>
  );
}

export default ThemeColorHelper;
