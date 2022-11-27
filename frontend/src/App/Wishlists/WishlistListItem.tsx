import {
  ChatIcon,
  CheckCircleIcon,
  DeleteIcon,
  ExternalLinkIcon,
} from "@chakra-ui/icons";
import {
  HStack,
  Tag,
  Link,
  useToast,
  IconButton,
  Text,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  ListIcon,
  Box,
  Flex,
} from "@chakra-ui/react";
import EditButton from "../../Components/EditButton";
import useDeleteWishlistItem from "../../Global/Api/Mutations/Wishlists/useDeleteWishlistItem";
import useEditWishlistItem, {
  EditWishlistItemInput,
} from "../../Global/Api/Mutations/Wishlists/useEditWishlistItem";
import useCurrentUser from "../../Global/Api/Queries/useCurrentUser";
import { Fulfillment, WishlistItem } from "../../Global/Api/Types/Api";
import useModalState from "../../Global/Helpers/ModalHelper";
import WishlistItemModal from "./Components/WishlistItemModal";
import FulfillItemButton from "./Components/FulfillItemButton";
import DashedCircleIcon from "../../Components/DashedCircleIcon";
import FlexButton from "../../Components/FlexButton";
import ViewFulfillmentsModal from "./Components/ViewFulfillmentsModal";

export default function WishlistListItem(props: WishlistListItemProps) {
  const { item, fulfillments, refetch, fulfillmentsRefetch } = props;

  const [open, modal] = useModalState();
  const [fulfillmentModalOpen, fulfillmentModal] = useModalState();
  const { data: me } = useCurrentUser();
  const { mutateAsync: editItem } = useEditWishlistItem(item.id);
  const { mutateAsync: deleteItem } = useDeleteWishlistItem(item.id);
  const toast = useToast();

  const canEdit = me?.id === item.owner_id;
  const censored = canEdit;

  async function onEdit(data: EditWishlistItemInput) {
    try {
      await editItem({ data });
      refetch?.();
      toast({
        description: `Successfully updated "${item.name}"!`,
      });
    } catch (e: any) {
      toast({
        status: "error",
        title: "Failed to update item.",
        description: e.toString(),
      });
    }
  }

  async function onDelete() {
    try {
      await deleteItem({});
      refetch?.();
      toast({
        description: `Successfully deleted "${item.name}"!`,
      });
    } catch (e: any) {
      toast({
        status: "error",
        title: "Failed to delete item.",
        description: e.toString(),
      });
    }
  }

  const needed = item.quantity;
  const qtyFulfilled = (fulfillments ?? []).reduce(
    (sum, entry) => sum + entry.quantity,
    0
  );
  // finished if there's a set quantity needed AND that amount has been fulfilled
  // items with no quantity means there is no upper limit
  const isFullyFulfilled = needed && qtyFulfilled >= needed;

  function getTagColor() {
    if (isFullyFulfilled) {
      return "green";
    } else if (qtyFulfilled > 0) {
      return "yellow";
    } else {
      return "red";
    }
  }

  return (
    <Flex alignItems="center">
      {isFullyFulfilled ? (
        <ListIcon as={CheckCircleIcon} color="green.500" />
      ) : (
        <ListIcon as={DashedCircleIcon} color="gray.500" />
      )}
      <HStack flexGrow={1} justifyContent="space-between">
        <Box maxWidth="fit-content">
          {item.url ? (
            <Link href={item.url} isExternal>
              {item.name} <ExternalLinkIcon />
            </Link>
          ) : (
            <Text>{item.name}</Text>
          )}
        </Box>
        <HStack spacing={1}>
          {!isFullyFulfilled && item.notes ? (
            <Popover>
              <PopoverTrigger>
                <FlexButton title="Notes" icon={<ChatIcon />} size="xs" />
              </PopoverTrigger>
              <PopoverContent>
                <PopoverArrow />
                <PopoverBody sx={{ whiteSpace: "pre-wrap" }}>
                  {item.notes}
                </PopoverBody>
              </PopoverContent>
            </Popover>
          ) : null}
        </HStack>
        <HStack spacing={1}>
          <Tag
            borderRadius="full"
            colorScheme={getTagColor()}
            minWidth="max-content"
            sx={{
              userSelect: "none",
              cursor: censored ? undefined : "pointer",
            }}
            onClick={censored ? undefined : fulfillmentModal.open}
          >
            {censored ? "?" : qtyFulfilled} / {needed ?? "∞"}
          </Tag>
          {canEdit ? (
            <>
              <EditButton onClick={modal.open} />
              <IconButton
                aria-label={`Delete ${item.name}`}
                icon={<DeleteIcon />}
                onClick={onDelete}
              />
            </>
          ) : !isFullyFulfilled ? (
            <FulfillItemButton
              item={item}
              variant="text"
              refetch={fulfillmentsRefetch}
            />
          ) : null}
        </HStack>
      </HStack>
      <WishlistItemModal
        open={open}
        setOpen={modal.set}
        title={`Edit ${item.name}`}
        submitName="Save"
        initialValues={item}
        onSubmit={onEdit}
      />
      <ViewFulfillmentsModal
        open={fulfillmentModalOpen}
        setOpen={fulfillmentModal.set}
        item={item}
        refetch={fulfillmentsRefetch}
      />
    </Flex>
  );
}

interface WishlistListItemProps {
  item: WishlistItem;
  fulfillments?: Fulfillment[];
  refetch?: () => void;
  fulfillmentsRefetch?: () => void;
}
