import containerQueries from '@tailwindcss/container-queries';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			colors: {
				fetch: {
					blue: '#007bff',
					indigo: '#6610f2',
					violet: '#510359',
					pink: '#ed6a7c',
					red: '#dc3545',
					orange: '#ffa900',
					yellow: '#ffdf02',
					green: '#04833e',
					teal: '#17799f',
					cyan: '#17a2b8',
					'gray-dark': '#343a40',
					'gray-light': '#f1ece9',
					'dark-purple': '#300d38',
					'light-purple': '#890a74',
					'blue-purple': '#6d62dd',
					'hot-pink': '#f90075',
					'another-purple': '#230871',
					'gray-purple': '#c7c1e0',
					'sky-blue': '#e5faff',
					'dark-sky-blue': '#ade7f5',
					primary: '#300d38',
					secondary: '#890a74',
					tertiary: '#ffa900',
					quaternary: '#ffdf02',
					links: '#6d62dd',
					'light-border': '#dee2e6',
					success: '#04833e',
					info: '#17a2b8',
					warning: '#ffdf02',
					danger: '#dc3545',
					focus: '#99d9f0',
					light: '#f8f9fa',
					dark: '#343a40'
				}
			},
			fontFamily: {
				lexend: ['Lexend', 'sans-serif'],
				rubik: ['Rubik', 'sans-serif'],
				cactus: ['Cactus', 'Arial', 'sans-serif']
			}
		}
	},

	plugins: [typography, forms, containerQueries]
} satisfies Config;
