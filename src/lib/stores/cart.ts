import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import type { CartItem, Repuesto } from '$lib/types';

const initialCart: CartItem[] = browser
	? JSON.parse(localStorage.getItem('cart') || '[]')
	: [];

const cart = writable<CartItem[]>(initialCart);

// Persist cart in localStorage for client navigation.
cart.subscribe((items) => {
	if (browser) {
		localStorage.setItem('cart', JSON.stringify(items));
	}
});

const addItem = (repuesto: Repuesto, cantidad = 1) => {
	cart.update((items) => {
		const existing = items.find((i) => i.repuesto.id === repuesto.id);
		if (existing) {
			return items.map((i) =>
				i.repuesto.id === repuesto.id ? { ...i, cantidad: i.cantidad + cantidad } : i
			);
		}
		return [...items, { repuesto, cantidad }];
	});
};

const updateQuantity = (id: string, cantidad: number) => {
	cart.update((items) =>
		items.map((i) =>
			i.repuesto.id === id ? { ...i, cantidad: Math.max(1, cantidad) } : i
		)
	);
};

const removeItem = (id: string) => {
	cart.update((items) => items.filter((i) => i.repuesto.id !== id));
};

const clear = () => cart.set([]);

export const cartStore = {
	subscribe: cart.subscribe,
	addItem,
	updateQuantity,
	removeItem,
	clear
};
