<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import { pbStatusStore, pbHost } from '$lib/stores/pbStatus';

	const links = [
		{ href: '/', label: 'Inicio' },
		{ href: '/tienda', label: 'Tienda' },
		{ href: '/productos', label: 'Productos' },
		{ href: '/cotizacion', label: 'Cotización' }
	];


	let theme: 'light' | 'dark' = 'light';
	let pbStatus: 'checking' | 'up' | 'down' = 'checking';
	let statusClass = 'down';
	$: pbStatus = $pbStatusStore;
	$: statusClass = pbStatus === 'up' ? 'up' : 'down';

	const applyTheme = (value: 'light' | 'dark') => {
		theme = value;
		if (typeof document !== 'undefined') {
			document.documentElement.dataset.theme = value;
			localStorage.setItem('theme', value);
		}
	};

	if (typeof window !== 'undefined') {
		const stored = localStorage.getItem('theme') as 'light' | 'dark' | null;
		const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
		applyTheme(stored ?? (prefersDark ? 'dark' : 'light'));
	}

	const toggleTheme = () => applyTheme(theme === 'light' ? 'dark' : 'light');
</script>

<div class="app">
	<header class="shell nav">
		<div class="brand">
			<img src="/logo.svg" alt="4AMotos" class="brand-logo" />
			<span class={`pill status ${statusClass}`}>
				{pbStatus === 'up' ? 'Live' : 'Offline'}
			</span>
		</div>
		<nav>
			{#each links as link}
				<a href={link.href} class:active={$page.url.pathname === link.href}>{link.label}</a>
			{/each}
			<a href="/productos/nuevo" class="cta">Agregar producto</a>
			<button class="ghost" type="button" on:click={toggleTheme} aria-label="Cambiar tema">
				{#if theme === 'dark'}
					<svg viewBox="0 0 24 24" aria-hidden="true" class="icon">
						<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
					</svg>
				{:else}
					<svg viewBox="0 0 24 24" aria-hidden="true" class="icon">
						<circle cx="12" cy="12" r="5" />
						<line x1="12" y1="1" x2="12" y2="3" />
						<line x1="12" y1="21" x2="12" y2="23" />
						<line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
						<line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
						<line x1="1" y1="12" x2="3" y2="12" />
						<line x1="21" y1="12" x2="23" y2="12" />
						<line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
						<line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
					</svg>
				{/if}
			</button>
		</nav>
	</header>

	<main class="shell">
		<slot />
	</main>

	<footer class="shell footer">
		<span>PocketBase · SvelteKit · 2025</span>
	</footer>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	.shell {
		width: 100%;
		max-width: 1600px;
		margin: 0 auto;
		padding: 1rem 1.5rem;
		box-sizing: border-box;
	}

	.nav {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 1.25rem 0 1.25rem;
		height: 84px;
		min-height: 84px;
		box-sizing: border-box;
	}

	.brand {
		display: inline-flex;
		align-items: center;
		gap: 0;
		font-weight: 700;
		letter-spacing: -0.01em;
		white-space: nowrap;
	}

	.status {
		border: 1px solid var(--border);
		background: rgba(255, 255, 255, 0.08);
		padding: 0.3rem 0.55rem;
		margin-left: -2px;
	}

	.status.up {
		background: linear-gradient(135deg, #22c55e, #16a34a);
		color: #0b1222;
		border: none;
	}

	.status.down {
		background: linear-gradient(135deg, #ef4444, #dc2626);
		color: #0b1222;
		border: none;
	}

	.brand-logo {
		height: 32px;
		width: auto;
		display: block;
	}

	nav {
		display: inline-flex;
		align-items: center;
		gap: 0.75rem;
		height: 40px;
	}

	nav a {
		padding: 0.5rem 0.85rem;
		border-radius: 12px;
		color: var(--ink-2);
		text-decoration: none;
		font-weight: 700;
		line-height: 1;
		transition: transform 120ms ease, background 150ms ease;
		border: 1px solid transparent;
	}

	nav a:hover {
		background: rgba(255, 255, 255, 0.06);
		transform: translateY(-1px);
	}

	nav a.active {
		border-color: var(--border);
		background: rgba(255, 255, 255, 0.04);
	}

	nav .ghost {
		background: transparent;
		border: 1px solid var(--border);
		color: var(--ink);
		padding: 0.45rem 0.55rem;
		border-radius: 12px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		box-shadow: none;
		width: 40px;
		height: 40px;
		flex-shrink: 0;
	}

	nav .ghost:hover {
		background: rgba(0, 0, 0, 0.06);
		transform: translateY(-1px);
	}

	.icon {
		width: 18px;
		height: 18px;
		fill: currentColor;
		stroke: currentColor;
		stroke-width: 1.6;
	}

	.cta {
		background: linear-gradient(120deg, var(--accent), var(--accent-2));
		color: #0b1222;
		box-shadow: none;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	.footer {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.9rem;
		color: var(--ink-3);
		padding-bottom: 2rem;
	}

	@media (max-width: 640px) {
		.nav {
			flex-direction: column;
			align-items: flex-start;
		}
	}
</style>
