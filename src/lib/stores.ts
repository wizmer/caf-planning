import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import { browser } from "$app/environment"

export const edition_enabled = writable(false)

export const user = writable(browser && localStorage.getItem("user"))
user.subscribe(value => {
    if(browser){
    localStorage.setItem("user", value);
    }
});
