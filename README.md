# Flex-SDK Conversations Demo App

Run  ` npm run dev `  to start the development server.

## Obtaining a JWT Token

To get the JWT token required for `createClient`, follow these steps:

1. Log in to [Flex](https://flex.twilio.com).
2. Open your browser's developer tools and navigate to the **Network** tab.
3. Filter the network logs by the keyword **"token"**.
4. Refresh the page.
5. Locate the JWT token in the filtered network requests.

6. Copy the JWT token from the network request.
7. Use this token as the `token` parameter in the `createClient` method.
