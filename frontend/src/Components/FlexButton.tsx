import {
  Button,
  ButtonProps,
  IconButton,
  IconButtonProps,
} from "@chakra-ui/react";

export default function FlexButton(props: FlexButtonProps) {
  const {
    icon,
    title,
    variant = "hybrid",
    iconSide = "right",
    ...other
  } = props;

  const unlabelled = <IconButton aria-label={title} icon={icon} {...other} />;

  const hasIcon = variant === "hybrid";
  const leftIcon = hasIcon && iconSide === "left" ? icon : undefined;
  const rightIcon = hasIcon && iconSide === "right" ? icon : undefined;
  const labelled = (
    <Button rightIcon={rightIcon} leftIcon={leftIcon} {...other}>
      {title}
    </Button>
  );

  return variant === "icon" ? unlabelled : labelled;
}

export type FlexButtonVariant = "text" | "icon" | "hybrid";

interface FlexButtonProps extends ButtonProps {
  title: string;
  icon: IconButtonProps["icon"];
  variant?: FlexButtonVariant;
  iconSide?: "left" | "right";
}
