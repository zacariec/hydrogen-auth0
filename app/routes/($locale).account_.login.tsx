import {Form} from '@remix-run/react';
import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useAuthenticator} from '~/utils/auth.server';

export async function loader({request, context}: LoaderFunctionArgs) {
  return await useAuthenticator(request, context).isAuthenticated(request, {
    successRedirect: '/account/authorize/multipass',
  });
}

export default function Login() {
  return (
    <Form action="/account/authorize" method="POST">
      <button>Login with Auth0</button>
    </Form>
  );
}
