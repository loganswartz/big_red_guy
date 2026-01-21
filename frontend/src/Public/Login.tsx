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
  HStack,
  Input,
  VStack,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { Link as ReactRouterLink, useNavigate } from "react-router-dom";
import BigRedGuy from "../Components/BigRedGuy";
import useLogin, { LoginInput } from "../Global/Api/Mutations/useLogin";

export default function Login() {
  const { mutateAsync } = useLogin();
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>();

  const navigate = useNavigate();

  async function onSubmit(data: LoginInput) {
    const response = await mutateAsync({ data });
    if (response?.success) {
      // we're logged in
      navigate("/app");
    } else {
      // show an error and clear the password field
      setValue("password", "");
      setError("root", {
        type: "custom",
        message: "Invalid email or password!",
      });
    }
  }

  return (
    <Container flexGrow={1} justifyContent="center" centerContent>
      <Card as="form" onSubmit={handleSubmit(onSubmit)} maxWidth="md">
        <CardHeader>
          <Center>
            <BigRedGuy as={ReactRouterLink} to="/" />
          </Center>
        </CardHeader>
        <CardBody>
          <VStack paddingX={4}>
            <Input
              placeholder="Email"
              {...register("email", { required: true })}
            />
            <Input
              placeholder="Password"
              type="password"
              {...register("password", { required: true })}
            />
            {errors.root ? (
              <Alert status="error">
                <AlertIcon />
                {errors.root.message}
              </Alert>
            ) : null}
          </VStack>
        </CardBody>
        <CardFooter>
          <HStack flexGrow={1} spacing={2} justifyContent="space-evenly">
            <Button as={ReactRouterLink} to="/forgot-password">
              Forgot Password?
            </Button>
            <Button colorScheme="teal" type="submit" isLoading={isSubmitting}>
              Login
            </Button>
          </HStack>
        </CardFooter>
      </Card>
    </Container>
  );
}
