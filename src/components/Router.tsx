import { Route, Routes } from "react-router-dom";
import Bans from "./Bans";
import Books from "./Books";
import Home from "./Home";
import Leas from "./Leas";
import Account from "./Account";

export const router = [
  { path: "/", element: <Home></Home> },
  { path: "/books", element: <Books></Books> },
  { path: "/bans", element: <Bans></Bans> },
  { path: "/leas", element: <Leas></Leas> },
  { path: "/account", element: <Account></Account> },
];

const Router = () => (
  <Routes>
    {router.map((route, idx) => (
      <Route key={idx} path={route.path} element={route.element}></Route>
    ))}
  </Routes>
);

export default Router;
