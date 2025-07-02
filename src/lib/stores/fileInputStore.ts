import { writable } from 'svelte/store';

/** Holds the <input type="file"> element inside the Dropzone. */
export const fileInputEl = writable<HTMLInputElement | null>(null);
