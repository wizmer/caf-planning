import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export const user = writable(browser ? localStorage.getItem('user') ?? '' : '');
export const last_user = writable(browser ? localStorage.getItem('last-user') ?? '' : '');
user.subscribe((value) => {
	if (browser) {
		localStorage.setItem('user', value);

		if (value) {
			localStorage.setItem('last-user', value);
			last_user.set(value);
		}
	}
});
