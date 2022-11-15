import { ChakraProvider } from "@chakra-ui/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { client } from "./Global/Api/Client";
import Login from "./Public/Login";
import FrontPage from "./Public/FrontPage";
import Register from "./Public/Register";
import Theme from "./Global/Theme";
import Home from "./App/Home";
import AuthRequired from "./App/AuthRequired";
import WishlistsIndex from "./App/Wishlists/WishlistsIndex";
import ViewWishlist from "./App/Wishlists/ViewWishlist";
import Root from "./Root";
import ViewParty from "./App/Parties/ViewParty";
import PartiesIndex from "./App/Parties/PartiesIndex";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      children: [
        {
          index: true,
          element: <FrontPage />,
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
              path: "parties/*",
              children: [
                {
                  index: true,
                  element: <PartiesIndex />,
                },
                {
                  path: ":id",
                  element: <ViewParty />,
                },
              ],
            },
            {
              path: "wishlists/*",
              children: [
                {
                  index: true,
                  element: <WishlistsIndex />,
                },
                {
                  path: ":id",
                  element: <ViewWishlist />,
                },
              ],
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
