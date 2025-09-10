import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	
	// Configuración específica para desarrollo
	server: {
		port: 5173,
		open: true
	},
	
	// Configuración para el build de producción
	build: {
		target: 'es2020'
		
	}
});