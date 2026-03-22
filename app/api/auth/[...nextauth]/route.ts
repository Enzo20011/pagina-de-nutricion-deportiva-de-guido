import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Administrador",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin@guidonutricion.com" },
        password: { label: "Contraseña", type: "password" }
      },
      async authorize(credentials) {
        // Permitir cualquier email y contraseña para pruebas
        if (credentials?.email && credentials?.password) {
          const user = {
            id: "1",
            name: credentials.email.split("@")[0] || "Usuario Prueba",
            email: credentials.email,
            role: "admin"
          };
          return user;
        }
        return null;
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.role = token.role;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,

};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
