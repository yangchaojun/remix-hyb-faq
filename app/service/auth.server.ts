import { redirect } from '@remix-run/cloudflare';
import { commitSession, getSession } from './sessions';

export async function requireUserSession(request: Request) {
  const session = await getSession(request.headers.get('Cookie'));
  if (!session) {
    // You can throw our helpers like `redirect` and `json` because they
    // return `Response` objects. A `redirect` response will redirect to
    // another URL, while other  responses will trigger the UI rendered
    // in the `ErrorBoundary`.
    // throw redirect('/');
    return null;
  }
  return session.get('token');
}

export async function setUserSession(request: Request, token: string) {
  const session = await getSession(request.headers.get('Cookie'));
  session.set('token', token);
  throw redirect('/', {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  });
}
