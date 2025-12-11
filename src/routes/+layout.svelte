<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import { pbStatusStore, pbHost } from '$lib/stores/pbStatus';
	import StoreFooter from '$lib/components/StoreFooter.svelte';

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
	<header class="nav">
		<div class="shell nav-inner">
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
		</div>
	</header>

	<main class="shell">
		<slot />
	</main>

	<StoreFooter />
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	.shell {
		width: 100%;
		max-width: 1200px;
		margin: 0 auto;
		padding: 1rem 1.5rem;
		box-sizing: border-box;
	}

	.nav {
		background: linear-gradient(120deg, var(--nav-bg-1), var(--nav-bg-2));
		border-bottom: 1px solid var(--nav-border);
		color: var(--nav-ink);
		width: 100%;
		box-sizing: border-box;
	}

	.nav-inner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 1rem 1.5rem 0.75rem;
		box-sizing: border-box;
	}

	.brand {
		display: inline-flex;
		align-items: center;
		gap: 0.05rem;
		font-weight: 700;
		letter-spacing: -0.01em;
		white-space: nowrap;
	}

	.status {
		border: 1px solid var(--nav-border);
		background: var(--nav-pill-bg);
		padding: 0.3rem 0.55rem;
		margin-left: -55px;
		color: var(--nav-ink);
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
		height: 48px;
		width: auto;
		display: block;
	}

	:global([data-theme='dark'] .brand-logo) {
		filter: brightness(1.1) invert(1) saturate(0.8);
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
		color: var(--nav-ink);
		text-decoration: none;
		font-weight: 700;
		line-height: 1;
		transition: transform 120ms ease, background 150ms ease, border-color 150ms ease;
		border: 1px solid transparent;
		background: var(--nav-pill-bg);
	}

	nav a:hover {
		background: var(--nav-pill-hover);
		transform: translateY(-1px);
	}

	nav a.active {
		border-color: var(--nav-border);
		background: var(--nav-pill-hover);
	}

	nav .ghost {
		background: var(--nav-pill-bg);
		border: 1px solid var(--nav-border);
		color: var(--nav-ink);
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
		background: var(--nav-pill-hover);
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
		background: var(--ink);
		color: var(--accent);
		box-shadow: none;
		border: 1px solid color-mix(in srgb, var(--ink) 40%, transparent);
	}

	.cta:hover {
		background: var(--ink-2);
		transform: translateY(-1px);
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		width: 100%;
		background: var(--bg);
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
