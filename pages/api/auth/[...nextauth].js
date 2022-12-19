import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // const res = await fetch("https://www.mecallapi.com/api/login", {
        const res = await fetch(
          "https://mern-api-yp9k.onrender.com/api/signin",
          {
            method: "POST",
            body: JSON.stringify(credentials),
            headers: { "Content-Type": "application/json" },
          }
        );
        const data = await res.json();
        console.log("data success---> ", data.success);
        console.log("data token---> ", data.token);
        console.log("data user---> ", data.user);
        console.log("data user.name---> ", data.user.name);
        console.log("data ---> ", data);

        // If no error and we have user data, return it
        if (data.success == true) {
          return [
            {
              email: data.user.email,
              name: data.user.name,
              image: data.user.image,
            },
          ];
        }
        return null;
      },
    }),
  ],
  // add secret แก้ Error Deploy NextJs
  secret: process.env.NEXT_PUBLIC_SECRET,
  callbacks: {
    async jwt({ token, user, account }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
        token.user = user;
      }
      return token;
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token.accessToken;
      session.user = token.user;
      return session;
    },
  },
};
export default NextAuth(authOptions);
