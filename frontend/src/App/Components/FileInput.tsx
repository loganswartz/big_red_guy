import { Input, InputProps, useMultiStyleConfig } from "@chakra-ui/react";

export function FileInput(props: InputProps) {
  const styles = useMultiStyleConfig("Button", { variant: "outline" });

  return (
    <Input
      type="file"
      sx={{
        "&::file-selector-button": {
          border: "none",
          outline: "none",
          mr: 2,
          pt: 1,
          ...styles,
        },
      }}
      {...props}
    />
  );
}
