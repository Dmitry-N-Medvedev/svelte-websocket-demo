const cspDirectives = Object.freeze([
  'default-src \'none\'',
  'img-src \'self\'',
  'font-src \'self\'',
  'manifest-src \'self\'',
  'style-src \'self\' \'unsafe-inline\'',
  'script-src \'self\' \'unsafe-inline\'',
  'connect-src \'self\' ws://localhost:5173/ ws://127.0.0.1:9090/',
  // FIXME: the IP should be taken from .env
  'report-uri http://127.0.0.1:9090/csp-violation-report',
]).join(';');

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  const response = await resolve(event);

  response.headers.set('Content-Security-Policy-Report-Only', cspDirectives);
 
  return response;
}