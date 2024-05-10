import {
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';
import { requireUserSession, setUserSession } from '~/service/auth.server';
import { commitSession, getSession } from '~/service/sessions';

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    {
      name: 'description',
      content: 'Welcome to Remix! Using Vite and Cloudflare!',
    },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get('Cookie'));
  const url = new URL(request.url);
  const token = url.searchParams.get('token');

  if (token) {
    await setUserSession(request, token);
  }

  const originToken = await requireUserSession(request);
  return json(
    {
      isLogin: !!originToken,
    },
    {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    },
  );
}

export function action({ request }: ActionFunctionArgs) {
  console.log('action first: ', request.url);
}

export default function Index() {
  const loaderData = useLoaderData<typeof loader>();
  return (
    <>
      <h1 className="text-3xl font-bold underline">faq</h1>
      <div>{loaderData.isLogin ? '已登录' : '未登录'}</div>
    </>
  );
}
