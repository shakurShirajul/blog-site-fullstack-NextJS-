import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import connectDB from "../../../../lib/mongodb";
import { User } from "../../../../models/User";

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "me@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        console.log("Credentials received:", credentials);

        await connectDB();

        if (!credentials?.email || !credentials.password) {
          throw new Error("Email and password are required");
        }

        const user = await User.findOne({
          email: credentials.email,
        });
        if (!user) {
          throw new Error("User not found");
        }

        console.log("User found:", user);

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image || "",
        };
      },
    }),
  ],

  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
      }
      return session;
    },
  },

  pages: {
    signIn: "/signIn", // optional custom sign-in page
    error: "/signin", // redirect on error
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
