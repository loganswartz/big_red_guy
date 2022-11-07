import { ChakraProvider } from "@chakra-ui/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { client } from "./Global/Api/Client";
import Login from "./Public/Login";
import Main from "./Public/Main";
import Register from "./Public/Register";
import Theme from "./Global/Theme";
import Home from "./App/Home";
import AuthRequired from "./App/AuthRequired";
import WishlistsIndex from "./App/Wishlists/WishlistsIndex";
import CreateWishlist from "./App/Wishlists/CreateWishlist";
import ViewWishlist from "./App/Wishlists/ViewWishlist";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Main />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/app/*",
      element: <AuthRequired />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "wishlists/*",
          children: [
            {
              index: true,
              element: <WishlistsIndex />,
            },
            {
              path: "add",
              element: <CreateWishlist />,
            },
            {
              path: ":id",
              element: <ViewWishlist />,
            },
          ],
        },
      ],
    },
  ]);

  return (
    <ChakraProvider theme={Theme}>
      <QueryClientProvider client={client}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ChakraProvider>
  );
}

export default App;
