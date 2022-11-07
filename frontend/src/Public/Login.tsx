import { Box, Button, HStack, Input, VStack } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { Link as ReactRouterLink, useNavigate } from "react-router-dom";
import BigRedGuy from "../Components/BigRedGuy";
import Card from "../Components/Card";
import ContentInMiddle from "../Components/ContentInMiddle";
import useLogin from "../Global/Api/Mutations/useLogin";

interface FormValues {
  email: string;
  password: string;
}

export default function Login() {
  const { mutateAsync } = useLogin();
  const { register, handleSubmit } = useForm<FormValues>();

  const navigate = useNavigate();
  /* const [_, setToken] = useAuthentication(); */

  async function onSubmit(data: FormValues) {
    const response = await mutateAsync({ data });
    if (response.success) {
      /* setToken(() => result.token ?? null); */
      navigate("/app");
    }
  }

  return (
    <ContentInMiddle>
      <Card>
        <VStack spacing={4}>
          <BigRedGuy />
          <Box>
            <form onSubmit={handleSubmit(onSubmit)}>
              <VStack>
                <Input placeholder="Email" {...register("email")} />
                <Input
                  placeholder="Password"
                  type="password"
                  {...register("password")}
                />
                <HStack>
                  <Button as={ReactRouterLink} to="/register">
                    Register
                  </Button>
                  <Button colorScheme="teal" type="submit">
                    Login
                  </Button>
                </HStack>
              </VStack>
            </form>
          </Box>
        </VStack>
      </Card>
    </ContentInMiddle>
  );
}
