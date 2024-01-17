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


export let refs = {
    benoit: {name: "benoit", range: [new Date(2024, 0, 14, 18, 30), new Date(2024, 0, 14, 21)]},
    pierre: {name: "pierre", range: [new Date(2024, 0, 14, 19, 30), new Date(2024, 0, 14, 22, 0)]},
    josiane: {name: "josiane", range: [new Date(2024, 0, 14, 19, 0), new Date(2024, 0, 14, 22, 0)]}
};
