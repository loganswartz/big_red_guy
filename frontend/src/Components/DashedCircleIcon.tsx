import { createIcon } from "@chakra-ui/icons";

const DashedCircleIcon = createIcon({
  displayName: "DashedCircleIcon",
  path: (
    <g
      fill="currentColor"
      stroke="currentColor"
      strokeLinecap="butt"
      strokeDasharray="3"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" fill="none" r="11"></circle>
    </g>
  ),
});

export default DashedCircleIcon;
