/**
 * Favorites management module for the Fetch A Friend application.
 * Handles synchronization between client-side state, localStorage, and cookies.
 */

import { writable } from 'svelte/store';
import { browser } from '$app/environment';

/**
 * Synchronizes favorites data with localStorage and cookies.
 * This enables both client-side persistence and server-side access to favorites.
 * @param {Set<string>} favorites - Set of favorite dog IDs to sync
 */
function syncToStorage(favorites: Set<string>) {
	if (!browser) return;

	// Persist to localStorage for client-side access
	localStorage.setItem('favorites', JSON.stringify([...favorites]));

	// Set cookie for server-side access (expires in 30 days)
	document.cookie = `favorites=${JSON.stringify([...favorites])}; path=/; max-age=${60 * 60 * 24 * 30}`;
}

/**
 * Clears all stored favorites data from both localStorage and cookies
 */
function clearStorage() {
	if (!browser) return;
	localStorage.removeItem('favorites');
	document.cookie = 'favorites=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
}

/**
 * Creates and returns a custom Svelte store for managing favorite dogs.
 * Includes methods for adding, removing, toggling, and clearing favorites.
 * Automatically syncs changes to localStorage and cookies.
 */
function createFavoritesStore() {
	// Initialize from localStorage if available
	const initialFavorites = browser
		? new Set<string>(JSON.parse(localStorage.getItem('favorites') || '[]'))
		: new Set<string>();

	const { subscribe, update, set } = writable(initialFavorites);

	return {
		subscribe,
		set: (value: Set<string>) => {
			set(value);
			syncToStorage(value);
		},
		add: (id: string) => {
			update((favorites) => {
				favorites.add(id);
				syncToStorage(favorites);
				return favorites;
			});
		},
		remove: (id: string) => {
			update((favorites) => {
				favorites.delete(id);
				syncToStorage(favorites);
				return favorites;
			});
		},
		toggle: (id: string) => {
			update((favorites) => {
				if (favorites.has(id)) {
					favorites.delete(id);
				} else {
					favorites.add(id);
				}
				syncToStorage(favorites);
				return favorites;
			});
		},
		clear: () => {
			clearStorage();
			set(new Set());
		}
	};
}

export const favorites = createFavoritesStore();
