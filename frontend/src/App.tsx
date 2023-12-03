import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./Public/Login";
import FrontPage from "./Public/FrontPage";
import Register from "./Public/Register";
import ForgotPassword from "./Public/ForgotPassword";
import ResetPassword from "./Public/ResetPassword";
import theme from "./Global/Theme";
import Home from "./App/Home";
import AuthRequired from "./App/AuthRequired";
import WishlistsIndex from "./App/Wishlists/WishlistsIndex";
import ViewWishlist from "./App/Wishlists/ViewWishlist";
import Root from "./Root";
import ViewParty from "./App/Parties/ViewParty";
import PartiesIndex from "./App/Parties/PartiesIndex";
import ThemeColorHelper from "./Global/ThemeColorHelper";
import { HelmetProvider } from "react-helmet-async";
import Settings from "./App/Settings";

const client = new QueryClient();

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
          path: "/forgot-password",
          element: <ForgotPassword />,
        },
        {
          path: "/reset-password",
          element: <ResetPassword />,
        },
        {
          path: "/app/*",
          element: <AuthRequired />,
          children: [
            {
              index: true,
              element: <Home />,
            },
            { path: "settings", element: <Settings /> },
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
    <HelmetProvider>
      <ChakraProvider theme={theme}>
        <ThemeColorHelper />
        <QueryClientProvider client={client}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </ChakraProvider>
    </HelmetProvider>
  );
}

export default App;
