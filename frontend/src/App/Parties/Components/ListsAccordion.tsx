import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  List,
} from "@chakra-ui/react";
import { User, WishlistWithItems } from "../../../Global/Api/Types/Api";
import WishlistListItem from "../../Wishlists/WishlistListItem";

export function ListsAccordion(props: ListsAccordionProps) {
  const { lists, refetch } = props;

  return (
    <Accordion allowMultiple allowToggle>
      {lists.map(({ wishlist, items }) => (
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                {wishlist.name}
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <List spacing={1}>
              {items.map((item) => (
                <WishlistListItem key={item.id} item={item} refetch={refetch} />
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
  refetch?: () => void;
}
