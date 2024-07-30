import {AppLoadContext} from '@remix-run/server-runtime';
import { createCookie } from '@shopify/remix-oxygen';
import {Authenticator} from 'remix-auth';
import {Auth0Strategy} from 'remix-auth-auth0';
import {auth0SessionStorage} from '~/sessions';

const authenticator = new Authenticator(auth0SessionStorage);

export const useAuthenticator = (
  request: Request,
  context: AppLoadContext,
): typeof authenticator => {
  const callbackURL = new URL(
    '/account/authorize/callback',
    request.url,
  ).href.toString();

  const auth0Strategy = new Auth0Strategy(
    {
      callbackURL,
      clientID: context.env.AUTH0_CLIENT_ID,
      clientSecret: context.env.AUTH0_CLIENT_SECRET,
      domain: context.env.AUTH0_DOMAIN,
    },
    async ({profile}) => {
      return profile;
    },
  );

  authenticator.use(auth0Strategy);

  return authenticator;
};

export const useAuth0Session = async (request: Request) => {
  const cookie = createCookie('__auth_0_session');

  try {
    const parsedCookie = await cookie.parse(request.headers.get('Cookie'));

    return parsedCookie;
  } catch (err) {
    console.error('Cookie doesn\'t exist');
  }
}
