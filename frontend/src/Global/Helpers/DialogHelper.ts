import { Dispatch, SetStateAction, useState } from "react";

interface DialogStateHelpers {
  set: Dispatch<SetStateAction<boolean>>;
  close: () => void;
  open: () => void;
  toggle: () => void;
}

export default function useDialogState(
  initial: boolean = false
): [boolean, DialogStateHelpers] {
  const [open, setOpen] = useState(initial);

  return [
    open,
    {
      set: setOpen,
      close: () => setOpen(false),
      open: () => setOpen(true),
      toggle: () => setOpen((current) => !current),
    },
  ];
}
