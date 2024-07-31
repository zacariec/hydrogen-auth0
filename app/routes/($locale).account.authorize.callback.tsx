import type {ActionFunctionArgs} from '@shopify/remix-oxygen';
import {useAuthenticator} from '~/utils/auth.server';

export async function loader({request, context}: ActionFunctionArgs) {
  const successRedirect = new URL(
    '/account/authorize/multipass',
    request.url,
  ).href.toString();
  const failureRedirect = new URL(
    '/account/login',
    request.url,
  ).href.toString();

  return useAuthenticator(request, context).authenticate('auth0', request, {
    successRedirect,
    failureRedirect,
  });
}
