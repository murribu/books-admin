import { useAuthenticator } from "@aws-amplify/ui-react";
import { Nav, Navbar } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { signOut } from "aws-amplify/auth";

const TopNav = () => {
  const { user } = useAuthenticator();

  const mySignOut = () => {
    console.log("signing out");
    signOut();
  };
  return (
    <Navbar bg="light" expand="lg" className="px-4">
      {/* @ts-ignore compatible */}
      <LinkContainer to="/">
        <Navbar.Brand>Books Admin</Navbar.Brand>
      </LinkContainer>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          {/* @ts-ignore compatible */}
          <LinkContainer to="/books">
            <Nav.Link>Books</Nav.Link>
          </LinkContainer>
          {/* @ts-ignore compatible */}
          <LinkContainer to="/bans">
            <Nav.Link>Bans</Nav.Link>
          </LinkContainer>
          {/* @ts-ignore compatible */}
          <LinkContainer to="/leas">
            <Nav.Link>LEAs</Nav.Link>
          </LinkContainer>
          {/* @ts-ignore compatible */}
          <LinkContainer to="/ban-types">
            <Nav.Link>Ban Types</Nav.Link>
          </LinkContainer>
        </Nav>
      </Navbar.Collapse>
      <Navbar.Collapse className="justify-content-end">
        {user && (
          /* @ts-ignore compatible */
          <LinkContainer to="/account">
            <Nav.Link>{user.signInDetails?.loginId}</Nav.Link>
          </LinkContainer>
        )}
        <Nav.Link onClick={mySignOut} className="mx-4">
          Sign Out
        </Nav.Link>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default TopNav;
