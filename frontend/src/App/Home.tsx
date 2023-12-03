import { Card, CardHeader, Center } from "@chakra-ui/react";
import useCurrentUser from "../Global/Api/Queries/useCurrentUser";

export default function Home() {
  const { data, status } = useCurrentUser();

  if (status === "loading") {
    return <>Loading...</>;
  } else if (!data) {
    return <>Something went wrong</>;
  }

  return (
    <Card maxWidth="sm">
      <CardHeader>
        <Center>Welcome, {data.name}!</Center>
      </CardHeader>
    </Card>
  );
}
