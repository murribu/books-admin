import { useAuthenticator } from "@aws-amplify/ui-react";

const Home = () => {
  const { user } = useAuthenticator();

  console.log(user.signInDetails?.loginId);
  return (
    <div>
      <h1>Home</h1>
      <p>Welcome to Books Admin!</p>
    </div>
  );
};

export default Home;
