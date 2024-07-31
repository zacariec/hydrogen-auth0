import {redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import { useMultipassToken } from '~/lib/multipass';

// fallback wild card for all unauthenticated routes in account section
export async function loader({context, request}: LoaderFunctionArgs) {
  const isLoggedIn = await useMultipassToken(request);

  if (!isLoggedIn) {
    return redirect('/account/login');
  }

  return redirect('/account');
}
