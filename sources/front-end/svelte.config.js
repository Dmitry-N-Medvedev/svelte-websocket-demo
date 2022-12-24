import adapter from '@sveltejs/adapter-node';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({
      out: 'build',
      precompress: false,
      envPrefix: 'CA_',
    }),
    serviceWorker: {
      register: false,
    },
  }
};

export default config;
