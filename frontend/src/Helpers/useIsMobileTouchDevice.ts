import { useMediaQuery } from "usehooks-ts";

/**
 * Check if the device is a mobile touch device (ie. a smart phone or tablet).
 *
 * https://www.w3.org/TR/mediaqueries-4/#mf-interaction
 */
export default function useIsMobileTouchDevice() {
  return useMediaQuery(
    "(hover: none) and ((pointer: coarse) or (pointer: fine))"
  );
}
