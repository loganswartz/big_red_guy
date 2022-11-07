import {
  Box,
  Button,
  Heading,
  Input,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import BigRedGuy from "../Components/BigRedGuy";
import Card from "../Components/Card";
import ContentInMiddle from "../Components/ContentInMiddle";
import useRegister from "../Global/Api/Mutations/useRegister";

export default function Register() {
  const { mutateAsync } = useRegister();
  const toast = useToast();
  const navigate = useNavigate();

  const { handleSubmit, register, watch } = useForm<FormValues>();
  const password = useRef({});
  password.current = watch("password", "");

  function onSubmit(values: FormValues) {
    try {
      mutateAsync({
        data: {
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

  return (
    <ContentInMiddle>
      <Card>
        <VStack spacing={4}>
          <BigRedGuy />
          <Box>
            <form onSubmit={handleSubmit(onSubmit)}>
              <VStack>
                <Heading size="md">Create an account:</Heading>
                <Input placeholder="Email" {...register("email")} />
                <Input
                  type="password"
                  placeholder="Password"
                  {...register("password")}
                />
                <Input
                  type="password"
                  placeholder="Confirm password"
                  {...register("confirm_password", {
                    validate: (value) =>
                      value === password.current ||
                      "The passwords do not match",
                  })}
                />
                <Button type="submit">Register</Button>
              </VStack>
            </form>
          </Box>
        </VStack>
      </Card>
    </ContentInMiddle>
  );
}

interface FormValues {
  email: string;
  password: string;
  confirm_password: string;
}
