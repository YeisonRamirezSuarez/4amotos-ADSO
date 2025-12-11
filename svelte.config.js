import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter({
			fallback: '200.html'
		}),
		prerender: {
			entries: []
		},

		// Alias específicos del proyecto
		alias: {
			'$lib': 'src/lib',
			'$components': 'src/lib/components',
			'$stores': 'src/lib/stores',
			'$utils': 'src/lib/utils'
		}
	}
};

export default config;
