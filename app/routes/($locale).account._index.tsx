import {LoaderFunctionArgs, redirect} from '@shopify/remix-oxygen';
import {useMultipassToken} from '~/lib/multipass';

export async function loader({ request }: LoaderFunctionArgs) {
  const isLoggedIn = await useMultipassToken(request);

  // show log in screen if not logged in, otherwise redirect to account/orders
  if (!isLoggedIn) {
    return redirect('/account/login');
  }

  return redirect('/account/orders');
}
