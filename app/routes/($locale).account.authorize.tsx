import {
  type ActionFunctionArgs,
} from '@shopify/remix-oxygen';
import {useAuthenticator} from '~/utils/auth.server';

export async function action({request, context}: ActionFunctionArgs) {
  return useAuthenticator(request, context).authenticate('auth0', request);
}
