import {
  PUBLIC_WS_PROTO,
  PUBLIC_WS_HOST,
  PUBLIC_WS_PORT,

  PUBLIC_WEB_PROTO,
  PUBLIC_WEB_HOST,
  PUBLIC_WEB_PORT,
} from '$env/static/public';

const cspDirectives = {
  'default-src': ['none'],
  'img-src': ['self'],
  'font-src': ['self'],
  'manifest-src': ['self'],
  'style-src': ['self', 'unsafe-inline'],
  'script-src': ['self', 'unsafe-inline'],
  'connect-src': [
    'self',
    // svelte dev server's port
    `${PUBLIC_WS_PROTO}://${PUBLIC_WEB_HOST}:${PUBLIC_WEB_PORT}/`,
    // API port
    `${PUBLIC_WS_PROTO}://${PUBLIC_WS_HOST}:${PUBLIC_WS_PORT}/`,
  ],
  'report-uri': [`${PUBLIC_WEB_PROTO}://${PUBLIC_WS_HOST}:${PUBLIC_WS_PORT}/csp-violation-report`],
};

const DIRECTIVES = Object.entries(cspDirectives).map(([key, values]) => `${key} ${values.map((value) => `'${value}'`).join(' ')}`).join(';');

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  const response = await resolve(event);

  response.headers.set('Content-Security-Policy-Report-Only', DIRECTIVES);
 
  return response;
}