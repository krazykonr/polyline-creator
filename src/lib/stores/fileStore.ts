import { writable } from 'svelte/store';

/** Currently selected file object */
export const selectedFile = writable<File | null>(null);

/** `null` = no file chosen yet; otherwise the file text. */
export const fileContent = writable<string | null>(null);
