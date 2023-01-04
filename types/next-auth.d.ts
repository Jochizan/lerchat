import NextAuth, { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's name. */
      _id?: string | null | undefined;
      name?: string | null | undefined;
      lastName?: string | null | undefined;
      image?: string | null | undefined;
      creator?: string | null | undefined;
      email?: string | null | undefined;
      state?: string | null | undefined;
    } & DefaultSession['user'];
    expires?: string | null | undefined;
  }

  interface User {
    _id?: string | null | undefined;
    creator?: string | null | undefined;
    name?: string | null | undefined;
    lastMame?: string | null | undefined;
    image?: string | null | undefined;
    email?: string | null | undefined;
    state?: string | null | undefined;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    _id?: string | null | undefined;
    creator?: string | null | undefined;
    name?: string | null | undefined;
    lastName?: string | null | undefined;
    image?: string | null | undefined;
    email?: string | null | undefined;
  }
}
