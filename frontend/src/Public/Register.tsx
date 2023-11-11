import {
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
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import BigRedGuy from "../Components/BigRedGuy";
import useRegister, {
  RegisterInput,
} from "../Global/Api/Mutations/useRegister";

export default function Register() {
  const { mutateAsync } = useRegister();
  const toast = useToast();
  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    watch,
    formState: { errors },
  } = useForm<FormValues>({ mode: "onBlur" });

  async function onSubmit(values: FormValues) {
    try {
      await mutateAsync({
        data: {
          name: values.name,
          email: values.email,
          password: values.password,
        },
      });
      navigate("/app");
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
    <Container flexGrow={1} justifyContent="center" centerContent>
      <Card maxWidth="sm" as="form" onSubmit={handleSubmit(onSubmit)}>
        <CardHeader>
          <Center>
            <BigRedGuy />
          </Center>
        </CardHeader>
        <CardBody>
          <VStack spacing={2} paddingX={4}>
            <Heading size="md">Create an account</Heading>
            <Input
              placeholder="Name"
              {...register("name", { required: true })}
            />
            <Input
              placeholder="Email"
              {...register("email", { required: true })}
            />
            <Input
              type="password"
              placeholder="Password"
              isInvalid={hasPasswordError}
              minLength={12}
              {...register("password", {
                minLength: passwordLengthRule,
                required: true,
              })}
            />
            <Input
              type="password"
              placeholder="Confirm password"
              isInvalid={hasPasswordError}
              {...register("confirm_password", {
                minLength: passwordLengthRule,
                validate: (value) =>
                  value === watch("password") || "Passwords do not match",
              })}
            />
            {notices.map(([_, error]) => (
              <Alert
                key={error.message}
                status="error"
                sx={{ borderRadius: "0.3rem" }}
              >
                <AlertIcon />
                <AlertDescription>{error.message}</AlertDescription>
              </Alert>
            ))}
          </VStack>
        </CardBody>
        <CardFooter justifyContent="center">
          <Button disabled={hasPasswordError} type="submit">
            Register
          </Button>
        </CardFooter>
      </Card>
    </Container>
  );
}

interface FormValues extends RegisterInput {
  confirm_password: string;
}
