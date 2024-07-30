import {createCookieSessionStorage} from '@shopify/remix-oxygen';

const sessionSecret = 'MY_COOL_SECRET';
export const auth0SessionStorage = createCookieSessionStorage({
  cookie: {
    name: '__auth_0_session',
    secrets: [sessionSecret],
    sameSite: 'lax',
  },
});

export const {
  getSession: getAuth0Session,
  commitSession: commitAuth0Session,
  destroySession: destroyAuth0Session,
} = auth0SessionStorage;

export const multipassSessionStorage = createCookieSessionStorage({
  cookie: {
    name: '__multipass_user_session',
    secrets: [sessionSecret],
    sameSite: 'lax',
  },
});

export const {
  getSession: getMultipassSession,
  commitSession: commitMultipassSession,
  destroySession: destroyMultipassSession,
} = auth0SessionStorage;
//
// interface Session {
//   session: SessionStorage | undefined;
//   get: <T>(arg0: string) => Promise<T | unknown>;
//   set: (arg0: Record<string, unknown>) => Promise<void>;
//   unset: (arg0: string) => Promise<Record<string, unknown> | undefined>;
//   init: () => Session;
//
// }
//
// class CookieSession implements Session {
//   session: SessionStorage | undefined;
//
//   public async get<T>(value: string): Promise<T | unknown> {
//     if (!this.session) {
//       throw Error('Session is not defined');
//     }
//
//     const session = await this.session.getSession();
//     try {
//       const sessionCookie = session.get('__session_auth');
//
//       if (!sessionCookie || sessionCookie === "") {
//         throw Error('Error getting cookie');
//       }
//
//       const sessionData = JSON.parse(sessionCookie);
//
//       if (!sessionData || typeof sessionData !== 'object') {
//         throw Error('Session data is not an object');
//       }
//
//       return (sessionData as Record<string, unknown>)[value];
//     } catch (err) {
//
//     }
//     return session.get(value);
//   }
//
//   public async unset(key: string): Promise<Record<string, unknown> | undefined> {
//     if (!this.session) {
//       throw Error('Session is not defined');
//     }
//
//     const session = await this.session.getSession();
//
//     try {
//       const data = JSON.parse(session.get('__session_auth')) as Record<string, unknown>;
//
//       delete data[key];
//
//       session.set<'__session_auth'>('__session_auth', JSON.stringify({
//         ...data,
//       }));
//
//       await this.session.commitSession(session);
//
//       return data;
//     } catch (err) {
//       console.error(err);
//     }
//   }
//
//   public async set(value: Record<string, unknown>): Promise<void> {
//     if (!this.session) {
//       throw Error('Session is not defined');
//     }
//
//     const session = await this.session.getSession();
//
//     try {
//       const data = JSON.parse(session.get('__session_auth')) as Record<string, unknown>;
//
//       session.set<'__session_auth'>('__session_auth', JSON.stringify({
//         ...data,
//         ...value,
//       }));
//
//       await this.session.commitSession(session);
//     } catch (err) {
//       console.error(err);
//     }
//   }
//
//   public init() {
//     this.session = createCookieSessionStorage({
//       cookie: {
//         name: '__session_auth',
//         secrets: [sessionSecret],
//         sameSite: 'lax',
//       }
//     });
//
//     return this;
//   }
// }
//
// export const session = CookieSession.init();
