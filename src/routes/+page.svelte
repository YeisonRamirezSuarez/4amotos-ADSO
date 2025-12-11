<script lang="ts">
	import { pbStatusStore, pbHost } from '$lib/stores/pbStatus';
	import PageHero from '$lib/components/PageHero.svelte';

	const statusCopy = ($status: 'checking' | 'up' | 'down') =>
		$status === 'up'
			? `API local activa en ${pbHost}`
			: `API local no disponible en ${pbHost}. Inicia PocketBase para usar la app.`;

	const statusColor = ($status: 'checking' | 'up' | 'down') => {
		if ($status === 'up') return 'background:linear-gradient(135deg, #22c55e, #16a34a);';
		if ($status === 'down') return 'background:linear-gradient(135deg, #ef4444, #dc2626);';
		return 'background:linear-gradient(135deg, #a3a3a3, #737373);';
	};
</script>

<svelte:head>
	<title>4AMotos | Inicio</title>
	<meta name="description" content="Consulta y cotiza repuestos de forma rápida con 4AMotos" />
</svelte:head>

<section class="home">
	<PageHero
		eyebrow="Marketplace de repuestos"
		title="Compra y cotiza 4AMotos en un solo lugar."
		subtitle="Explora el catálogo, filtra por disponibilidad y precio, agrega a tu cotización y genera totales en segundos."
		meta={statusCopy($pbStatusStore)}
	/>

	<div class="home-grid">
		<div class="cta">
			<div class="cta-actions">
				<a href="/productos"><button>Explorar catálogo</button></a>
				<a href="/cotizacion"><button class="secondary">Ver cotización</button></a>
			</div>
			<div class="pill-row">
				<div class="pill">+2k referencias</div>
				<div class="pill">Stock en vivo</div>
				<div class="pill">PocketBase + SvelteKit</div>
			</div>
		</div>
		<div class="status panel" style="border-style:dashed; border-color: var(--border); background: rgba(255,255,255,0.02);">
			<p class="muted" style="margin:0 0 0.5rem 0;">Estado</p>
			<div style="display:flex; align-items:center; gap:0.5rem;">
				<span style={`width:10px; height:10px; border-radius:50%; ${statusColor($pbStatusStore)}`}></span>
				<span>{statusCopy($pbStatusStore)}</span>
			</div>
			<p class="muted" style="margin-top:0.75rem;">Dashboard PocketBase: <a href={`http://${pbHost}/_/`} target="_blank" rel="noreferrer">http://{pbHost}/_/</a></p>
			<p class="muted" style="margin-top:0.25rem;">Usa el botón “Agregar producto” en la barra superior para cargar inventario.</p>
		</div>
	</div>
</section>

<style>
	.home {
		max-width: 1600px;
		width: 100%;
		margin: 32px auto 120px;
		padding: 0 0 48px;
		display: flex;
		flex-direction: column;
		gap: 16px;
		color: var(--ink-2);
	}

	.home-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
		gap: 16px;
		align-items: start;
	}

	.cta {
		display: grid;
		gap: 12px;
		padding: 16px;
		border: 1px solid var(--border);
		border-radius: 14px;
		background: linear-gradient(145deg, var(--panel), var(--panel-soft));
		box-shadow: var(--shadow);
	}

	.cta-actions {
		display: flex;
		gap: 12px;
		flex-wrap: wrap;
	}

	.pill-row {
		display: flex;
		gap: 12px;
		flex-wrap: wrap;
	}

	.status {
		padding: 16px;
		box-shadow: var(--shadow);
	}
</style>
