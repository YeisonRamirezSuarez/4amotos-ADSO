import { writable } from 'svelte/store';
import type { Repuesto } from '$lib/types';

export const products = writable<Repuesto[]>([]);
