import cookies from 'js-cookie';

export const setCookies = (accessToken: string) => {
  cookies.set('accessToken', accessToken);
};

export async function loadConfig(url: string) {
  const resp = await fetch(url);

  const data = await resp.json();

  return data;
}