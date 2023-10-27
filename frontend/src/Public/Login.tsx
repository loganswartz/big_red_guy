import {
  Alert,
  AlertIcon,
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
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link as ReactRouterLink, useNavigate } from "react-router-dom";
import BigRedGuy from "../Components/BigRedGuy";
import useLogin, { LoginInput } from "../Global/Api/Mutations/useLogin";

export default function Login() {
  const { mutateAsync } = useLogin();
  const { register, handleSubmit, setValue } = useForm<LoginInput>();
  const [error, setError] = useState<string>();

  const navigate = useNavigate();

  async function onSubmit(data: LoginInput) {
    const response = await mutateAsync({ data });
    if (response?.success) {
      // we're logged in
      setError(undefined);
      navigate("/app");
    } else {
      // show an error and clear the password field
      setValue("password", "");
      setError("Invalid email or password!");
    }
  }

  return (
    <Container flexGrow={1} justifyContent="center" centerContent>
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
            {error ? (
              <Alert status="error">
                <AlertIcon />
                {error}
              </Alert>
            ) : null}
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
