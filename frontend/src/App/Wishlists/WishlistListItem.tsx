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
  VStack,
  ListItem,
  useColorModeValue,
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
import ConfirmationModal from "./Components/ConfirmDeleteModal";

export default function WishlistListItem(props: WishlistListItemProps) {
  const { item, fulfillments, refetch, fulfillmentsRefetch } = props;

  const [editModalOpen, editModel] = useModalState();
  const [fulfillmentModalOpen, fulfillmentModal] = useModalState();
  const [deleteModalOpen, deleteModal] = useModalState();
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

  const itemBg = useColorModeValue("gray.100", "gray.600");

  return (
    <ListItem p={2} borderRadius={4} background={itemBg}>
      <Flex alignItems="center" flexGrow={1}>
        <HStack spacing={2} flexGrow={1}>
          <VStack alignItems="center" spacing={1}>
            <ListIcon
              {...(isFullyFulfilled
                ? {
                    as: CheckCircleIcon,
                    color: "green.500",
                  }
                : {
                    color: "gray.500",
                    as: DashedCircleIcon,
                  })}
              m={0}
            />
            <Tag
              borderRadius="full"
              colorScheme={getTagColor()}
              minWidth="max-content"
              userSelect="none"
              cursor={censored ? undefined : "pointer"}
              onClick={censored ? undefined : fulfillmentModal.open}
            >
              {censored ? "?" : qtyFulfilled} / {needed ?? "∞"}
            </Tag>
          </VStack>
          <VStack spacing={1} flexGrow={1} alignItems="center">
            <Box maxWidth="fit-content">
              {item.url ? (
                <Link href={item.url} isExternal overflowWrap="anywhere">
                  {item.name} <ExternalLinkIcon />
                </Link>
              ) : (
                <Text overflowWrap="anywhere">{item.name}</Text>
              )}
            </Box>
            <HStack spacing={1} justifyContent="center">
              {!isFullyFulfilled && item.notes ? (
                <Popover>
                  <PopoverTrigger>
                    <FlexButton title="Notes" icon={<ChatIcon />} />
                  </PopoverTrigger>
                  <PopoverContent>
                    <PopoverArrow />
                    <PopoverBody whiteSpace="pre-wrap">
                      {item.notes}
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
              ) : null}
              {canEdit ? (
                <>
                  <EditButton onClick={editModel.open} />
                  <IconButton
                    aria-label={`Delete ${item.name}`}
                    icon={<DeleteIcon />}
                    onClick={deleteModal.open}
                  />
                </>
              ) : !isFullyFulfilled ? (
                <FulfillItemButton item={item} refetch={fulfillmentsRefetch} />
              ) : null}
            </HStack>
          </VStack>
        </HStack>
        <WishlistItemModal
          open={editModalOpen}
          setOpen={editModel.set}
          title="Edit Item"
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
        <ConfirmationModal
          open={deleteModalOpen}
          setOpen={deleteModal.set}
          title="Delete item?"
          onConfirm={onDelete}
        >
          Are you sure you want to delete "{item.name}"?
        </ConfirmationModal>
      </Flex>
    </ListItem>
  );
}

interface WishlistListItemProps {
  item: WishlistItem;
  fulfillments?: Fulfillment[];
  refetch?: () => void;
  fulfillmentsRefetch?: () => void;
}
