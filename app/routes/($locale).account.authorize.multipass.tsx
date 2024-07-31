import {createCookie, LoaderFunctionArgs, redirect} from '@shopify/remix-oxygen';
import {generateToken} from '~/lib/multipass';
import {commitMultipassSession, getMultipassSession} from '~/sessions';
import {useAuthenticator} from '~/utils/auth.server';

export type Auth0AuthenticatedUser = {
  provider: string;
  _json: {
    sub: string;
    given_name: string;
    family_name: string;
    nickname: string;
    name: string;
    updated_at: string;
    email: string;
    email_verified: boolean;
  };
  id: string;
  displayName: string;
  name: {
    familyName: string;
    givenName: string;
  };
  emails: {value: string}[];
  photos: {value: string}[];
};

export type MultipassAuthenticatedUser = {
  customerAccessTokenCreateWithMultipass: {
    customerUserErrors: {}[];
    customerAccessToken: {
      accessToken: string;
      expiresAt: string;
    };
  };
};

export async function loader({request, context}: LoaderFunctionArgs) {
  const isAuthenticated = (await useAuthenticator(
    request,
    context,
  ).isAuthenticated(request)) as null | Auth0AuthenticatedUser;

  if (!isAuthenticated) {
    throw Error("Shouldn't have reached here, unauthenticated user");
  }

  const multipass = await generateToken(
    context.env.MULTIPASS_SECRET,
    isAuthenticated,
  );
  const multipassSession = await getMultipassSession();
  const hasMultipass = await multipassSession.get('__multipass_user_session');

  if (hasMultipass !== undefined || (hasMultipass && hasMultipass !== '')) {
    try {
      JSON.parse(hasMultipass);

      return redirect('/');
    } catch (err) {
      // invalid multipass cookie
      multipassSession.unset('__multipass_user_session');
      await commitMultipassSession(multipassSession);

      return redirect('/account/login');
    }
  }

  const payload = `#graphql
  mutation customerAccessTokenCreateWithMultipass($multipassToken: String!) {
    customerAccessTokenCreateWithMultipass(multipassToken: $multipassToken) {
      customerUserErrors {
        code
        field
        message
      }
      customerAccessToken {
        accessToken
        expiresAt
      }
    }
  }
  `;

  const multipassRequest = (await context.storefront.mutate(payload, {
    variables: {multipassToken: multipass},
  })) as MultipassAuthenticatedUser;

  const multipassUserPayload = {
    token:
      multipassRequest.customerAccessTokenCreateWithMultipass
        .customerAccessToken.accessToken,
    expiresAt:
      multipassRequest.customerAccessTokenCreateWithMultipass
        .customerAccessToken.expiresAt,
  };

  return new Response(null, {
    status: 302,
    headers: {
      ...request.headers,
      Location: '/',
      'Set-Cookie': await createCookie('__multipass_user_session', {
        path: '/',
        sameSite: 'lax',
      }).serialize(multipassUserPayload),
    }
  });
}
