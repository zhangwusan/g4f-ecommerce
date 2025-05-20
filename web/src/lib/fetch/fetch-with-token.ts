import { getServerSession } from 'next-auth';
import { authOptions } from '../next-auth/options';

export const fetchWithToken = async (
  input: RequestInfo,
  init: RequestInit = {}
): Promise<Response> => {
  const session = await getServerSession(authOptions);
  const token = session?.user?.access_token;

  console.log('Token 1: ', token)

  const headers = new Headers(init.headers || {});
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  headers.set('Content-Type', 'application/json');

  return fetch(input, {
    ...init,
    headers,
  });
};


export const fetchWithTokenFormData = async (
  input: RequestInfo,
  init: RequestInit = {}
): Promise<Response> => {
  const session = await getServerSession(authOptions);
  const token = session?.user?.access_token;

  const headers = new Headers(init.headers || {});
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // DO NOT set Content-Type manually for FormData
  return fetch(input, {
    ...init,
    headers,
  });
};