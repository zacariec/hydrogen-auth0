import {Form} from '@remix-run/react';
import {
  createCookie,
  redirect,
  type ActionFunctionArgs,
} from '@shopify/remix-oxygen';
import {useMultipassToken} from '~/lib/multipass';
import {useAuth0Session} from '~/utils/auth.server';

// if we dont implement this, /account/logout will get caught by account.$.tsx to do login
// export async function loader() {
//   return redirect('/');
// }

export async function action({request, context}: ActionFunctionArgs) {
  // const multipassSession = await useMultipassToken(request);
  // const auth0Session = await useAuth0Session(request);
  const multipassCookie = createCookie('__multipass_user_session');
  const auth0Cookie = createCookie('__auth_0_session');

  const logoutURL = `https://${context.env.AUTH0_DOMAIN}/v2/logout?returnTo=/`;

  // logoutURL.searchParams.set('client_id', context.env.AUTH0_CLIENT_ID);
  // logoutURL.searchParams.set('returnTo', '/');

  return new Response(null, {
    status: 302,
    headers: {
      ...request.headers,
      Location: logoutURL.toString(),
      'Set-Cookie': await multipassCookie.serialize('', {maxAge: 1}),
      // @ts-ignore
      'Set-Cookie': await auth0Cookie.serialize('', {maxAge: 1}),
    },
  });
}

export default function Logout() {
  return (
    <Form action="/account/logout" method="POST">
      <button>Logout</button>
    </Form>
  );
}
