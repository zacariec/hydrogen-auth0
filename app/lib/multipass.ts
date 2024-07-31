import { createCookie } from '@shopify/remix-oxygen';
import type {
  Auth0AuthenticatedUser,
  MultipassAuthenticatedUser,
} from '~/routes/($locale).account.authorize.multipass';
import {getMultipassSession} from '~/sessions';

export async function digest(secret: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(secret);
  const hash = await crypto.subtle.digest('SHA-256', data);
  const hashArray = new Uint8Array(hash);

  const encryptionKey = hashArray.slice(0, 16);
  const signatureKey = hashArray.slice(16, 32);

  return {encryptionKey, signatureKey};
}

export function arrayBufferToBase64Url(buffer: Uint8Array) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export async function encrypt(
  payload: string,
  encryptionKey: Uint8Array,
): Promise<Uint8Array> {
  const encoder = new TextEncoder();
  const data = encoder.encode(payload);
  const iv = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey(
    'raw',
    encryptionKey,
    {name: 'AES-CBC'},
    false,
    ['encrypt'],
  );
  const encrypted = await crypto.subtle.encrypt(
    {name: 'AES-CBC', iv},
    key,
    data,
  );

  return new Uint8Array([...iv, ...new Uint8Array(encrypted)]);
}

export async function sign(
  cipher: BufferSource,
  signatureKey: Uint8Array,
): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    'raw',
    signatureKey,
    {name: 'HMAC', hash: 'SHA-256'},
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign('HMAC', key, cipher);
  return new Uint8Array(signature);
}

export async function generateToken(
  secret: string,
  customer: Auth0AuthenticatedUser,
): Promise<string> {
  const {encryptionKey, signatureKey} = await digest(secret);
  const payload = JSON.stringify({
    email: customer.emails[0].value,
    // first_name: customer.name.givenName,
    // last_name: customer.name.familyName,
    created_at: new Date().toISOString(),
  });
  const cipher = await encrypt(payload, encryptionKey);
  const signature = await sign(cipher, signatureKey);
  const token = arrayBufferToBase64Url(
    new Uint8Array([...cipher, ...signature]),
  );

  return token;
}

export async function useMultipassToken(request: Request): Promise<MultipassAuthenticatedUser | undefined> {
  const cookie = createCookie('__multipass_user_session');

  try {
    const parsedCookie = await cookie.parse(request.headers.get('Cookie'));

    return parsedCookie;
  } catch (err) {
    console.error('Cookie doesn\'t exist');
  }
}
