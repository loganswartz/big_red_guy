import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  Container,
  Input,
  VStack,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { Link as ReactRouterLink, useNavigate } from "react-router-dom";
import BigRedGuy from "../Components/BigRedGuy";
import useLogin, { LoginInput } from "../Global/Api/Mutations/useLogin";

export default function Login() {
  const { mutateAsync } = useLogin();
  const { register, handleSubmit } = useForm<LoginInput>();

  const navigate = useNavigate();

  async function onSubmit(data: LoginInput) {
    const response = await mutateAsync({ data });
    if (response?.success) {
      navigate("/app");
    }
  }

  return (
    <Container height="100vh" justifyContent="center" centerContent>
      <Card as="form" onSubmit={handleSubmit(onSubmit)} maxWidth="md">
        <CardHeader>
          <Center>
            <BigRedGuy />
          </Center>
        </CardHeader>
        <CardBody>
          <VStack paddingX={4}>
            <Input placeholder="Email" {...register("email")} />
            <Input
              placeholder="Password"
              type="password"
              {...register("password")}
            />
          </VStack>
        </CardBody>
        <CardFooter justifyContent="space-evenly">
          <Button as={ReactRouterLink} to="/register">
            Register
          </Button>
          <Button colorScheme="teal" type="submit">
            Login
          </Button>
        </CardFooter>
      </Card>
    </Container>
  );
}
