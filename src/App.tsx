import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import "./App.css";
import Router from "./components/Router";
import TopNav from "./components/TopNav";
import { Book, Lea, useBookContext } from "./contexts/bookContext";
import { generateClient } from "aws-amplify/api";
import { getOmni } from "./graphql/queries";
import { useEffect } from "react";

export const client = generateClient({
  authMode: "userPool",
});

const signUpFields = {
  signUp: {
    email: {
      order: 1,
    },
    password: {
      order: 2,
    },
    confirm_password: {
      order: 3,
    },
  },
};

interface GetOmniReturn {
  data: {
    getOmni: {
      PK: string;
      SK: string;
      books: Book[];
      leas: Lea[];
      tags: string[];
    };
  };
}

function App() {
  const { setLeas, setBooks, setTags } = useBookContext();

  const fetchOmni = async () => {
    const response = (await client.graphql({
      query: getOmni,
    })) as GetOmniReturn;
    setLeas(response.data.getOmni.leas);
    setBooks(
      response.data.getOmni.books?.map((book, index) => ({ ...book, index })) ??
        []
    );
    setTags(
      response.data.getOmni.tags?.map((tag, index) => ({ name: tag, index })) ??
        []
    );
  };

  useEffect(() => {
    fetchOmni();
  }, []);

  return (
    <Authenticator
      hideSignUp={true}
      loginMechanisms={["email"]}
      formFields={signUpFields}
    >
      {() => (
        <div>
          <TopNav></TopNav>
          <Container>
            <Router></Router>
          </Container>
        </div>
      )}
    </Authenticator>
  );
}

export default App;
