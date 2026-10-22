import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from './prisma';

export const authOptions: NextAuthOptions = {
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    CredentialsProvider({
      id: 'demo-login',
      name: 'Demo Classmate',
      credentials: {
        email: { label: 'Email', type: 'text' },
        name: { label: 'Name', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;

        let user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              email: credentials.email,
              name: credentials.name || 'New Classmate',
              division: '8-B',
              rollNumber: '1',
              motto: 'Ready to study! 📚',
              xp: 50,
              rankTitle: 'Bronze',
              palette: 'palette-retro',
              themeMode: 'light',
              pfpType: 'emoji',
              pfpValue: '🦉',
            },
          });
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        let dbUser = null;
        if (user.email) {
          dbUser = await prisma.user.findUnique({
            where: { email: user.email },
          });

          if (!dbUser) {
            dbUser = await prisma.user.create({
              data: {
                email: user.email,
                name: user.name || 'Grade 8 Student',
                image: user.image,
                pfpType: user.image ? 'image' : 'emoji',
                pfpValue: user.image || '🦉',
                division: '8-B',
                rollNumber: '1',
                motto: 'Ready to study! 📚',
                xp: 50,
                rankTitle: 'Bronze',
                palette: 'palette-retro',
                themeMode: 'light',
              },
            });
          }
        }
        token.sub = dbUser ? dbUser.id : user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.sub && session.user) {
        (session.user as any).id = token.sub;
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub },
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            division: true,
            rollNumber: true,
            pfpType: true,
            pfpValue: true,
            motto: true,
            xp: true,
            rankTitle: true,
            palette: true,
            themeMode: true,
          },
        });
        if (dbUser) {
          Object.assign(session.user, dbUser);
        }
      }
      return session;
    },
  },
  pages: {
    signIn: '/',
  },
  secret: process.env.NEXTAUTH_SECRET || 'icse-grade8-secret-fallback',
};
