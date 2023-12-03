import { Card, CardBody, CardHeader, Heading, VStack } from "@chakra-ui/react";
import DarkmodeToggle from "../Components/DarkmodeToggle";

export default function Settings() {
  return (
    <Card maxWidth="sm">
      <CardHeader>
        <Heading>Settings</Heading>
      </CardHeader>
      <CardBody>
        <VStack justifyContent="center">
          <DarkmodeToggle />
        </VStack>
      </CardBody>
    </Card>
  );
}
