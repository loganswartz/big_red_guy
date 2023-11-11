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
import useResetPassword from "../Global/Api/Mutations/useResetPassword";

interface ResetPasswordForm {
  password: string;
  confirm_password: string;
}

export default function ResetPassword() {
  const { mutateAsync } = useResetPassword();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<ResetPasswordForm>({ mode: "onBlur" });
  const [success, setSuccess] = useState(false);

  async function onSubmit(data: ResetPasswordForm) {
    if (data.password !== data.confirm_password) {
      setError("root", {
        type: "custom",
        message: "Passwords do not match.",
      });
      return;
    } else if (token === null) {
      return;
    }

    const response = await mutateAsync({
      data: {
        token,
        password: data.password,
      },
    });

    if (response?.success) {
      setSuccess(true);
    } else {
      setError("root", { type: "custom", message: "Unknown error occurred." });
    }
  }

  // get token from query string
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");

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
            {success ? (
              <Alert status="success">
                <AlertIcon />
                Your password was successfully reset!
              </Alert>
            ) : token ? (
              <>
                <Text>Enter your new password.</Text>
                <Input
                  placeholder="New Password"
                  type="password"
                  autoFocus
                  {...register("password")}
                />
                <Input
                  placeholder="Confirm Password"
                  type="password"
                  {...register("confirm_password", {
                    validate: (val) =>
                      watch("password") === val || "The passwords don't match.",
                  })}
                />
                {errors.root || errors.confirm_password ? (
                  <Alert status="error">
                    <AlertIcon />
                    {errors.root?.message || errors.confirm_password?.message}
                  </Alert>
                ) : null}
              </>
            ) : (
              <Text>Something went wrong.</Text>
            )}
          </VStack>
        </CardBody>
        <CardFooter justifyContent="space-evenly">
          {success || !token ? (
            <Button as={ReactRouterLink} to="/login">
              Back to Login
            </Button>
          ) : (
            <Button colorScheme="teal" type="submit" isLoading={isSubmitting}>
              Change Password
            </Button>
          )}
        </CardFooter>
      </Card>
    </Container>
  );
}
