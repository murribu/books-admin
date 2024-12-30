import { Route, Routes } from "react-router-dom";
import Bans from "./Bans";
import Books from "./Books";
import Home from "./Home";
import Leas from "./Leas";
import Account from "./Account";
import BookComponent from "./Book";
import BanTypes from "./BanTypes";
import BanComponent from "./Ban";

export const router = [
  { path: "/", element: <Home></Home> },
  { path: "/books", element: <Books></Books> },
  { path: "/bans", element: <Bans></Bans> },
  { path: "/leas", element: <Leas></Leas> },
  { path: "/account", element: <Account></Account> },
  { path: "/ban-types", element: <BanTypes></BanTypes> },
  { path: "/books/:id", element: <BookComponent></BookComponent> },
  { path: "/bans/:id", element: <BanComponent></BanComponent> },
];

const Router = () => (
  <Routes>
    {router.map((route, idx) => (
      <Route key={idx} path={route.path} element={route.element}></Route>
    ))}
  </Routes>
);

export default Router;
