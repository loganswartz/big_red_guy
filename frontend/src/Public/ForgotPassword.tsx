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
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link as ReactRouterLink } from "react-router-dom";
import BigRedGuy from "../Components/BigRedGuy";
import useForgotPassword, {
  ForgotPasswordInput,
} from "../Global/Api/Mutations/useForgotPassword";

export default function ForgotPassword() {
  const { mutateAsync } = useForgotPassword();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({ mode: "onBlur" });
  const [requested, setRequested] = useState(false);

  async function onSubmit(data: ForgotPasswordInput) {
    const response = await mutateAsync({ data });
    if (response?.success) {
      setRequested(true);
    } else {
      setError("root", { type: "custom", message: "Unknown error occurred." });
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
            {requested ? (
              <Alert status="success">
                <AlertIcon />
                We've sent you an email with instructions on how to reset your
                password.
              </Alert>
            ) : (
              <>
                <Text>
                  Enter your email address and we'll send you a link to reset
                  your password.
                </Text>
                <Input
                  placeholder="Email"
                  {...register("email", { required: true })}
                />
                {errors.email ? (
                  <Alert status="error">
                    <AlertIcon />
                    {errors.email.message}
                  </Alert>
                ) : null}
              </>
            )}
          </VStack>
        </CardBody>
        <CardFooter justifyContent="space-evenly">
          {requested ? (
            <Button as={ReactRouterLink} to="/login">
              Back to Login
            </Button>
          ) : (
            <Button colorScheme="teal" type="submit" isLoading={isSubmitting}>
              Submit
            </Button>
          )}
        </CardFooter>
      </Card>
    </Container>
  );
}
