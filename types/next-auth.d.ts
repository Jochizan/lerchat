import NextAuth from 'next-auth';

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
    };
    expires?: string | null | undefined;
  }

  interface User {
    csrfToken?: string | null | undefined;
    name?: string | null | undefined;
    image?: string | null | undefined;
    email?: string | null | undefined;
    json?: string | null | undefined;
    callbackUrl?: string | null | undefined;
    redirect?: string | null | undefined;
  }
}
