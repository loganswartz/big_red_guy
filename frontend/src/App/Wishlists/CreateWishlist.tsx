import {
  Center,
  Heading,
  HStack,
  Input,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Card from "../../Components/Card";
import useAddWishlist from "../../Global/Api/Mutations/useCreateWishlist";

interface FormValues {
  name: string;
}

export default function CreateWishlist() {
  const { mutateAsync } = useAddWishlist();
  const { handleSubmit, register } = useForm<FormValues>();
  const toast = useToast();
  const navigate = useNavigate();

  async function onSubmit(data: FormValues) {
    try {
      const created = await mutateAsync({ data });
      navigate(`/app/wishlists/${created.id}`);
    } catch (e: any) {
      toast({
        title: "An error occurred.",
        description: e.toString(),
        status: "error",
      });
    }
  }

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack>
          <Center>
            <Heading>Create a Wishlist</Heading>
          </Center>
          <HStack>
            <Input placeholder="Name" {...register("name")} />
          </HStack>
          <Center>
            <Input type="submit" value="Create" />
          </Center>
        </VStack>
      </form>
    </Card>
  );
}
