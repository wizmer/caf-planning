// @ts-check
import { join } from 'path';

// 1. Import the Skeleton plugin
import { skeleton } from '@skeletonlabs/tw-plugin';
import { cafTheme } from './caf-theme.js';

/** @type {import('tailwindcss').Config} */
export default {
	// 2. Opt for dark mode to be handled via the class method
	darkMode: 'selector',
	content: [
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}',
		'./src/**/*.{html,js,svelte,ts}',
		// 3. Append the path to the Skeleton package
		join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')
	],
	theme: {
		extend: {}
	},
	plugins: [
		// 4. Append the Skeleton plugin (after other plugins)
		require('@tailwindcss/forms'),
		require('flowbite/plugin'),
		skeleton({
			themes: {
				preset: ['skeleton', 'modern', 'crimson'],
				custom: [cafTheme]
			}
		})
	]
};
