import NextAuth, { NextAuthOptions } from 'next-auth';
import { NextApiRequest, NextApiResponse } from 'next';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import Facebook from 'next-auth/providers/facebook';
import Credentials from 'next-auth/providers/credentials';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import { connectToDatabase } from 'libs/mongodb';

export const authOptions: NextAuthOptions = {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID + '',
      clientSecret: process.env.GITHUB_SECRET + ''
    }),
    Google({
      clientId: process.env.GOOGLE_ID + '',
      clientSecret: process.env.GOOGLE_SECRET + ''
    }),
    Facebook({
      clientId: process.env.FACEBOOK_ID + '',
      clientSecret: process.env.FACEBOOK_SECRET + ''
    }),
    Credentials({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'credentials',
      // type: 'credentials',
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        const res = await fetch(
          `${process.env.NEXTAUTH_URL}/api/auth/credentials`,
          {
            method: 'POST',
            body: JSON.stringify(credentials),
            headers: { 'Content-Type': 'application/json' }
          }
        );

        const user = await res.json();
        if (res.ok && user) return user;

        return null;
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)
      }
    })
  ],
  // The secret should be set to a reasonably long random string.
  // It is used to sign cookies and to sign and encrypt JSON Web Tokens, unless
  // a separate secret is defined explicitly for encrypting the JWT.

  secret: process.env.SECRET,

  adapter: MongoDBAdapter(connectToDatabase()),
  // database: process.env.MONGODB_URI,

  session: {
    // Use JSON Web Tokens for session instead of database sessions.
    // This option can be used with or without a database for users/accounts.
    // Note: `jwt` is automatically set to `true` if no database is specified.
    strategy: 'jwt', // Server can be an SMTP connection string or a nodemailer config object

    // Seconds - How long until an idle session expires and is no longer valid.
    maxAge: 30 * 24 * 60 * 60, // 30 days

    // Seconds - Throttle how frequently to write to database to extend a session.
    // Use it to limit write operations. Set to 0 to always update the database.
    // Note: This option is ignored if using JSON Web Tokens
    updateAge: 24 * 60 * 60 // 24 hours
  },

  // JSON Web tokens are only used for sessions if the `jwt: true` session
  // option is set - or by default if no database is specified.
  // https://next-auth.js.org/configuration/options#jwt
  jwt: {
    secret: process.env.JWT_SECRET + ''
    // signingKey: process.env.JWT_SIGNING_PRIVATE_KEY,
    // A secret to use for key generation (you should set this explicitly)
    // Set to true to use encryption (default: false)
    // encryption: true,
    // encryptionKey: process.env.JWT_ENCRYPTION_PRIVATE_KEY,
    // You can define your own encode/decode functions for signing and encryption
    // if you want to override the default behaviour.
    // verificationOptions: {
    // algorithms: ['HS512']
    // }
    // encode: async ({ secret, token, maxAge }) => {},
    // decode: async ({ secret, token, maxAge }) => {},
  },

  // You can define custom pages to override the built-in ones. These will be regular Next.js pages
  // so ensure that they are placed outside of the '/api' folder, e.g. signIn: '/auth/mycustom-signin'
  // The routes shown here are the default URLs that will be used when a custom
  // pages is not specified for that route.
  // https://next-auth.js.org/configuration/pages
  pages: {
    signIn: '/auth/signin', // Displays signin buttons
    signOut: '/auth/signout', // Displays form with sign out button
    error: '/auth/error' // Error code passed in query string as ?error=
    // verifyRequest: '/auth/verify-request', // Used for check email page
    // newUser: null // If set, new users will be directed here on first sign in
  },

  // Callbacks are asynchronous functions you can use to control what happens
  // when an action is performed.
  // https://next-auth.js.org/configuration/callbacks
  callbacks: {
    // signIn: ({ user, account, profile, email, credentials }) => {
    //   return true;
    // },
    // redirect: ({ url, baseUrl }) => {
    //   return baseUrl;
    // },
    session: ({ session, token, user }) => {
      delete token['iat'];
      delete token['exp'];
      delete token['jti'];
      session.user && (session.user = token);
      return session;
    },
    jwt: ({ token, user, account, profile, isNewUser }) => {
      if (user) {
        token._id = user._id;
        token.creator = user.creator;
        token.image = user.image;
      }
      return token;
    }
  },

  // Events are useful for logging
  // https://next-auth.js.org/configuration/events
  events: {},

  // theme: 'dark',

  logger: {
    error(code, ...message) {
      console.log(code, message);
    },
    warn(code, ...message) {
      console.warn(code, message);
    },
    debug(code, ...message) {
      console.debug(code, message);
    }
  },

  // Enable debug messages in the console if you are having problems
  debug: process.env.NODE_ENV === 'development'
};

async function Auth(req: NextApiRequest, res: NextApiResponse) {
  return await NextAuth(req, res, authOptions);
}

export default Auth;
