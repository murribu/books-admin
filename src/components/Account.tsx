import { useAuthenticator } from "@aws-amplify/ui-react";

const Account = () => {
  const { user } = useAuthenticator();

  return (
    <div>
      <h1>Account</h1>
      <p>Username: {user.signInDetails?.loginId}</p>
    </div>
  );
};
export default Account;
