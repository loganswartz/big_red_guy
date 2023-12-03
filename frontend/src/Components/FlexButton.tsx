import {
  Button,
  ButtonProps,
  IconButton,
  IconButtonProps,
  useBreakpointValue,
  forwardRef,
} from "@chakra-ui/react";

const FlexButton = forwardRef((props: FlexButtonProps, ref) => {
  const {
    icon,
    title,
    variant: userVariant,
    iconSide = "right",
    breakpoints = {},
    ...other
  } = props;

  const autoVariant = useBreakpointValue(
    {
      base: "icon",
      xs: "icon",
      sm: "text",
      lg: "hybrid",
      ...breakpoints,
    },
    { ssr: false }
  );
  const variant = userVariant ?? autoVariant;

  const unlabelled = (
    <IconButton aria-label={title} icon={icon} ref={ref} {...other} />
  );

  const hasIcon = variant === "hybrid";
  const leftIcon = hasIcon && iconSide === "left" ? icon : undefined;
  const rightIcon = hasIcon && iconSide === "right" ? icon : undefined;
  const labelled = (
    <Button rightIcon={rightIcon} leftIcon={leftIcon} ref={ref} {...other}>
      {title}
    </Button>
  );

  return variant === "icon" ? unlabelled : labelled;
});

export type FlexButtonVariant = "text" | "icon" | "hybrid";

export interface FlexButtonProps extends ButtonProps {
  title: string;
  icon: IconButtonProps["icon"];
  variant?: FlexButtonVariant;
  iconSide?: "left" | "right";
  breakpoints?: Record<string, FlexButtonVariant>;
}

export default FlexButton;
