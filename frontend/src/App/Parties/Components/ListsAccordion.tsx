import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Heading,
  HStack,
  List,
  Text,
} from "@chakra-ui/react";
import { User, WishlistWithItems } from "../../../Global/Api/Types/Api";
import { GroupedFulfillments } from "../../../Global/Helpers/FulfillmentHelpers";
import WishlistListItem from "../../Wishlists/WishlistListItem";

export function ListsAccordion(props: ListsAccordionProps) {
  const { lists, fulfillments, refetch, fulfillmentsRefetch } = props;

  return (
    <Accordion allowMultiple>
      {lists.map(({ wishlist, items }) => (
        <AccordionItem key={wishlist.id}>
          <Heading size="md">
            <AccordionButton>
              <HStack flexGrow={1} justifyContent="space-between">
                <Text>{wishlist.name}</Text>
                <HStack spacing={1}>
                  <Text as="i" color="GrayText">
                    {items.length} {items.length === 1 ? "item" : "items"}
                  </Text>
                  <AccordionIcon color="GrayText" />
                </HStack>
              </HStack>
            </AccordionButton>
          </Heading>
          <AccordionPanel pb={4}>
            <List spacing={1}>
              {items.map((item) => (
                <WishlistListItem
                  key={item.id}
                  item={item}
                  fulfillments={fulfillments[item.id]}
                  fulfillmentsRefetch={fulfillmentsRefetch}
                  refetch={refetch}
                />
              ))}
            </List>
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export interface ListsAccordionProps {
  user: User;
  lists: WishlistWithItems[];
  fulfillments: GroupedFulfillments;
  refetch?: () => void;
  fulfillmentsRefetch?: () => void;
}
