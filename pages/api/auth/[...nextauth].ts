import NextAuth from 'next-auth';
import { NextApiRequest, NextApiResponse } from 'next';
import Providers from 'next-auth/providers';

async function Auth(req: NextApiRequest, res: NextApiResponse) {
  return await NextAuth(req, res, {
    providers: [
      Providers.GitHub({
        clientId: process.env.GITHUB_ID,
        clientSecret: process.env.GITHUB_SECRET
      }),
      Providers.Google({
        clientId: process.env.GOOGLE_ID + '',
        clientSecret: process.env.GOOGLE_SECRET + ''
      }),
      Providers.Facebook({
        clientId: process.env.FACEBOOK_ID + '',
        clientSecret: process.env.FACEBOOK_SECRET + ''
      })
    ],
    // The secret should be set to a reasonably long random string.
    // It is used to sign cookies and to sign and encrypt JSON Web Tokens, unless
    // a separate secret is defined explicitly for encrypting the JWT.

    secret: process.env.SECRET,

    database: process.env.MONGODB_URI,

    session: {
      // Use JSON Web Tokens for session instead of database sessions.
      // This option can be used with or without a database for users/accounts.
      // Note: `jwt` is automatically set to `true` if no database is specified.
      jwt: true, // Server can be an SMTP connection string or a nodemailer config object

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
      secret: process.env.JWT_SECRET,
      signingKey: process.env.JWT_SIGNING_PRIVATE_KEY,
      // A secret to use for key generation (you should set this explicitly)
      // Set to true to use encryption (default: false)
      encryption: true,
      encryptionKey: process.env.JWT_ENCRYPTION_PRIVATE_KEY,
      // You can define your own encode/decode functions for signing and encryption
      // if you want to override the default behaviour.
      verificationOptions: {
        algorithms: ['HS512']
      }
      // encode: async ({ secret, token, maxAge }) => {},
      // decode: async ({ secret, token, maxAge }) => {},
    },

    // You can define custom pages to override the built-in ones. These will be regular Next.js pages
    // so ensure that they are placed outside of the '/api' folder, e.g. signIn: '/auth/mycustom-signin'
    // The routes shown here are the default URLs that will be used when a custom
    // pages is not specified for that route.
    // https://next-auth.js.org/configuration/pages
    pages: {
      // signIn: '/auth/signin',  // Displays signin buttons
      // signOut: '/auth/signout', // Displays form with sign out button
      // error: '/auth/error' // Error code passed in query string as ?error=
      // verifyRequest: '/auth/verify-request', // Used for check email page
      // newUser: null // If set, new users will be directed here on first sign in
    },

    // Callbacks are asynchronous functions you can use to control what happens
    // when an action is performed.
    // https://next-auth.js.org/configuration/callbacks
    callbacks: {
      // async signIn(user, account, profile) { return true },
      // async redirect(url, baseUrl) { return baseUrl },
      // async session(session, user) { return session },
      // async jwt(token, user, account, profile, isNewUser) { return token }
    },

    // Events are useful for logging
    // https://next-auth.js.org/configuration/events
    events: {},

    theme: 'dark',

    // Enable debug messages in the console if you are having problems
    debug: process.env.NODE_ENV === 'development'
  });
}

export default Auth;
