import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/connectDB';
import Emaployee from '@/model/Employee';
import process from 'process';
import Employee from '@/model/Employee';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        try {
          const employee = await Employee.findOne({
            email: credentials.email,
          });

          if (!employee) {
            throw new Error('No user found with this email');
          }


          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            employee.password
          );

          if (isPasswordCorrect) {

            return {
              _id: employee._id.toString(),
              name: employee.name,
              email: employee.email,
            }
          } else {
            throw new Error('Incorrect password');
          }
        } catch (err: any) {
          console.error('Error during authorization:', err.message || err);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user?._id;
        token.name = user?.name ?? undefined;
        token.email = user?.email ?? undefined;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          _id: token._id,
          name: token.name,
          email: token.email,
        };
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/signin',
  },
};