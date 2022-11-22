import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Heading,
  List,
} from "@chakra-ui/react";
import { User, WishlistWithItems } from "../../../Global/Api/Types/Api";
import { GroupedFulfillments } from "../../../Global/Helpers/FulfillmentHelpers";
import WishlistListItem from "../../Wishlists/WishlistListItem";

export function ListsAccordion(props: ListsAccordionProps) {
  const { lists, fulfillments, refetch, fulfillmentsRefetch } = props;

  return (
    <Accordion allowMultiple allowToggle>
      {lists.map(({ wishlist, items }) => (
        <AccordionItem key={wishlist.id}>
          <Heading size="md">
            <AccordionButton>
              <Box flex="1" textAlign="left">
                {wishlist.name}
              </Box>
              <AccordionIcon />
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
