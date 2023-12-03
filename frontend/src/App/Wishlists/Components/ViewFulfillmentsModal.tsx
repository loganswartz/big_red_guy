import { DeleteIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Table,
  TableContainer,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Box,
  Center,
  ButtonGroup,
  IconButton,
} from "@chakra-ui/react";
import { useState } from "react";
import EditButton from "../../../Components/EditButton";
import useDeleteFulfillment from "../../../Global/Api/Mutations/Fulfillments/useDeleteFulfillment";
import useEditFulfillment from "../../../Global/Api/Mutations/Fulfillments/useEditFulfillment";
import useItemFulfillments from "../../../Global/Api/Queries/WishlistItems/useItemFulfillments";
import { Fulfillment, WishlistItem } from "../../../Global/Api/Types/Api";
import useModalState from "../../../Global/Helpers/ModalHelper";
import FulfillItemModal, { FulfillItemFormValues } from "./FulfillItemModal";

export default function ViewFulfillmentsModal(
  props: ViewFulfillmentsModalProps
) {
  const { open, setOpen, item, refetch: userRefetch } = props;

  const [editing, setEditing] = useState<Fulfillment>();
  const [editOpen, editModal] = useModalState();
  const { data, refetch } = useItemFulfillments(item.id, open);
  const { mutateAsync: deleteFulfillment } = useDeleteFulfillment();
  const { mutateAsync: editFulfillment } = useEditFulfillment();

  async function onDelete(id: number) {
    await deleteFulfillment({ path: [id] });
    await refetch();
    userRefetch?.();
  }

  async function onEdit(data: FulfillItemFormValues) {
    await editFulfillment({ path: [editing?.id ?? ""], data });
    await refetch();
    userRefetch?.();
  }

  const hasFulfillments = data && data.length > 0;

  return (
    <>
      <Modal isOpen={open} onClose={() => setOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Fulfillments for {item.name ?? "this item"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {hasFulfillments ? (
              <TableContainer whiteSpace="normal">
                <Table size="sm">
                  <Thead>
                    <Tr>
                      <Th>Qty</Th>
                      <Th>Notes</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {data?.map(({ fulfillment, editable }) => (
                      <Tr key={fulfillment.id}>
                        <Td>
                          <Box>{fulfillment.quantity}</Box>
                        </Td>
                        <Td overflowWrap="anywhere">
                          {fulfillment?.notes ?? null}
                        </Td>
                        <Td>
                          {editable ? (
                            <ButtonGroup spacing={2}>
                              <EditButton
                                onClick={() => {
                                  setEditing(fulfillment);
                                  editModal.open();
                                }}
                              />
                              <IconButton
                                aria-label="Delete"
                                icon={<DeleteIcon />}
                                onClick={() => onDelete(fulfillment.id)}
                              />
                            </ButtonGroup>
                          ) : null}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            ) : (
              <Center>
                <i>There are no fulfillments for this item yet.</i>
              </Center>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
      <FulfillItemModal
        title="Edit Fulfillment"
        open={editOpen}
        setOpen={editModal.set}
        initialValues={editing}
        onSubmit={onEdit}
        onCancel={() => setEditing(undefined)}
        submitName="Save"
      />
    </>
  );
}

interface ViewFulfillmentsModalProps {
  open: boolean;
  setOpen: (state: boolean) => void;
  item: WishlistItem;
  refetch?: () => void;
}
