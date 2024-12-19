import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { config } from "./config";
import { Amplify, ResourcesConfig } from "aws-amplify";
import { BrowserRouter } from "react-router-dom";
import { BookContext, BookContextProvider } from "./contexts/bookContext";

const { apiurl, UserPoolClientId, UserPoolId, CognitoIdentityPool } = config;

const myAppConfig: ResourcesConfig = {
  Auth: {
    Cognito: {
      userPoolId: UserPoolId,
      userPoolClientId: UserPoolClientId,
      identityPoolId: CognitoIdentityPool,
      loginWith: {
        email: true,
      },
      signUpVerificationMethod: "code",
      userAttributes: {
        email: {
          required: true,
        },
      },
      allowGuestAccess: false,
      passwordFormat: {
        minLength: 8,
        requireLowercase: true,
        requireNumbers: true,
        requireUppercase: true,
      },
    },
  },
  API: {
    GraphQL: {
      endpoint: apiurl,
      region: "us-east-1",
      // https://github.com/aws-amplify/amplify-js/issues/4361#issuecomment-559182509
      // @ts-ignore
      defaultAuthMode: "AMAZON_COGNITO_USER_POOLS",
    },
  },
};
Amplify.configure(myAppConfig);
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <BrowserRouter>
    <React.StrictMode>
      <BookContextProvider>
        <App />
      </BookContextProvider>
    </React.StrictMode>
  </BrowserRouter>
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
