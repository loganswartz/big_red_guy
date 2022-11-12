import { Dispatch, SetStateAction, useState } from "react";

interface ModalStateHelpers {
  set: Dispatch<SetStateAction<boolean>>;
  close: () => void;
  open: () => void;
  toggle: () => void;
}

export default function useModalState(
  initial: boolean = false
): [boolean, ModalStateHelpers] {
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
