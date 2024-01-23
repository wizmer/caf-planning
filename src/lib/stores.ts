import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import { browser } from "$app/environment"

export const user = writable(browser && localStorage.getItem("user"))
user.subscribe(value => {
    if(browser){
        localStorage.setItem("user", value);
    }
});
