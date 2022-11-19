import {
  AbsoluteCenter,
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  Container,
  Heading,
  Input,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import BigRedGuy from "../Components/BigRedGuy";
import useRegister from "../Global/Api/Mutations/useRegister";

export default function Register() {
  const { mutateAsync } = useRegister();
  const toast = useToast();
  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    watch,
    formState: { errors },
  } = useForm<FormValues>();
  const password = useRef({});
  password.current = watch("password", "");

  async function onSubmit(values: FormValues) {
    try {
      await mutateAsync({
        data: {
          name: values.name,
          email: values.email,
          password: values.password,
        },
      });
      navigate("/app/home");
    } catch (e: any) {
      toast({
        status: "error",
        title: "Unable to register",
        description: e.toString(),
      });
    }
  }

  const notices = Object.entries(errors);
  const hasPasswordError = !!errors.confirm_password;
  const passwordLengthRule = {
    value: 12,
    message: "Password must be at least 12 characters",
  };

  return (
    <AbsoluteCenter>
      <Card minWidth="md" as="form" onSubmit={handleSubmit(onSubmit)}>
        <CardHeader>
          <Center>
            <BigRedGuy />
          </Center>
        </CardHeader>
        <CardBody>
          <Container>
            <VStack spacing={2}>
              <Heading size="md">Create an account</Heading>
              <Input placeholder="Name" {...register("name")} />
              <Input placeholder="Email" {...register("email")} />
              <Input
                type="password"
                placeholder="Password"
                isInvalid={hasPasswordError}
                minLength={12}
                {...register("password", { minLength: passwordLengthRule })}
              />
              <Input
                type="password"
                placeholder="Confirm password"
                isInvalid={hasPasswordError}
                {...register("confirm_password", {
                  minLength: passwordLengthRule,
                  validate: (value) =>
                    value === password.current || "The passwords do not match",
                })}
              />
              {notices.map(([_, error]) => (
                <Alert status="error" sx={{ borderRadius: "0.3rem" }}>
                  <AlertIcon />
                  <AlertDescription>{error.message}</AlertDescription>
                </Alert>
              ))}
            </VStack>
          </Container>
        </CardBody>
        <CardFooter justifyContent="center">
          <Button disabled={hasPasswordError} type="submit">
            Register
          </Button>
        </CardFooter>
      </Card>
    </AbsoluteCenter>
  );
}

interface FormValues {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
}
