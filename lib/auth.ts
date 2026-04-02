import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Administrador",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin@guidonutricion.com" },
        password: { label: "Contraseña", type: "password" }
      },
      async authorize(credentials) {
        const authorized = [
          { email: 'enzovillalbaaaa@gmail.com', password: process.env.ENZO_PASSWORD || 'enzo.2001' },
          { email: 'lic.guidooperuk@gmail.com', password: process.env.GUIDO_PASSWORD }
        ];

        const userAuth = authorized.find(
          u => u.email.toLowerCase() === credentials?.email?.toLowerCase() && u.password === credentials?.password
        );

        if (userAuth) {
          return {
            id: userAuth.email === 'enzovillalbaaaa@gmail.com' ? 'enzo' : 'guido',
            name: userAuth.email === 'enzovillalbaaaa@gmail.com' ? 'Enzo' : 'Guido',
            email: userAuth.email,
            role: "admin"
          };
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
        (session.user as any).role = token.role;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
};
