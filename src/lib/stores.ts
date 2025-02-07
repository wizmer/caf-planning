import { browser } from '$app/environment';
import { writable } from 'svelte/store';

export const admin = writable(false);
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

export const REFERENT = 'référent·e';
