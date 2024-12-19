echo "export const config = {
  PROJECT_NAME: \"$PROJECT_NAME\",
  UserPoolClientId: \"$USER_POOL_CLIENT_ID\",
  UserPoolId: \"$USER_POOL_ID\",
  apiurl:
    \"$API_URL\",
  CognitoIdentityPool: \"$IDENTITY_POOL_ID\",
  connectionArn: \"\",
  repo: \"\",
  repoOwner: \"\",
  branch: \"\",
};" > src/config.ts