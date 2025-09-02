import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// This is a placeholder for the NextAuth configuration
// In a real application, you would connect this to a database

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // This is where you would verify the user credentials against your database
        // For this placeholder, we'll just check for a demo account
        if (credentials?.email === 'user@example.com' && credentials?.password === 'password') {
          return {
            id: '1',
            name: 'Demo User',
            email: 'user@example.com',
          };
        }
        return null;
      }
    })
  ],
  pages: {
    signIn: '/sign-in',
    signOut: '/sign-out',
    error: '/sign-in', // Error code passed in query string as ?error=
    newUser: '/sign-up' // New users will be directed here on first sign in
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user = { 
          name: session.user.name,
          email: session.user.email,
          image: session.user.image,
          ...token, // Spread the token properties instead of explicitly setting id
        };
      }
      return session;
    }
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-key-for-development-only',
});

export { handler as GET, handler as POST };