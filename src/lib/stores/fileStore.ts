import { writable } from 'svelte/store'

/** `null` = no file chosen yet; otherwise the file text. */
export const fileContent = writable<string | null>(null)
