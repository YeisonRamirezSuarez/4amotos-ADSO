<script lang="ts">
  import type { PageData } from './$types';
  import type { CartItem, Repuesto } from '$lib/types';
  import { repuestosService } from '$lib/utils/pocketbase';
  import { cartStore } from '$lib/stores/cart';
  import FiltersBar from '$lib/components/FiltersBar.svelte';
  import PageHero from '$lib/components/PageHero.svelte';

  export let data: PageData;

  const PAGE_SIZE = 24;

  let search = data.search ?? '';
  let categoria = data.categoria ?? '';
  let disponibles = data.disponibles ?? false;
  let page = data.page ?? 1;
  let precioMin = data.precioMin ?? '';
  let precioMax = data.precioMax ?? '';

  let repuestos: Repuesto[] = data.repuestos?.items ?? [];
  let totalItems = data.repuestos?.totalItems ?? 0;
  let totalPages = data.repuestos?.totalPages ?? 1;
  let categorias = data.categorias ?? [];
  let loading = false;

  let cart: CartItem[] = [];
  let showCart = false;
  let brokenImages = new Set<string>();
  const placeholderImage = '/placeholder-product.svg';

  $: cart = $cartStore;

  async function fetchPage(nextPage = page) {
    loading = true;
    try {
      const filters = {
        nombre: search.trim() || undefined,
        categoria: categoria || undefined,
        disponible: disponibles ? true : undefined,
        precio_min: precioMin ? Number(precioMin) : undefined,
        precio_max: precioMax ? Number(precioMax) : undefined
      };

      const res = await repuestosService.search(filters, nextPage, PAGE_SIZE);
      repuestos = res.items ?? [];
      totalItems = res.totalItems ?? repuestos.length;
      page = res.page ?? nextPage;
      totalPages = Math.max(1, Math.ceil((res.totalItems ?? repuestos.length) / PAGE_SIZE));
    } finally {
      loading = false;
    }
  }

  function updateFilters() {
    fetchPage(1);
  }

  function resetFilters() {
    search = '';
    categoria = '';
    disponibles = false;
    precioMin = '';
    precioMax = '';
    fetchPage(1);
  }

  function addToCart(item: Repuesto) {
    cartStore.addItem(item);
    showCart = true;
  }

  function removeFromCart(id: string) {
    cartStore.removeItem(id);
  }

  function handleImageError(event: Event, url?: string) {
    const img = event.currentTarget as HTMLImageElement;
    img.src = placeholderImage;
    if (!url) return;
    const next = new Set(brokenImages);
    next.add(url);
    brokenImages = next;
  }

  const resolveImage = (item: Repuesto) =>
    item.imagen_url && !brokenImages.has(item.imagen_url) ? item.imagen_url : placeholderImage;

  const isPlaceholder = (item: Repuesto) => !item.imagen_url || brokenImages.has(item.imagen_url);

  const formatCurrency = (value: number | string) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(Number(value));
</script>

<svelte:head>
  <title>Tienda | 4amotos</title>
</svelte:head>

<section class="page">
  <PageHero
    eyebrow="Catálogo 4amotos"
    title="Repuestos listos para enviar"
    subtitle="Filtra por categoría, disponibilidad o rango de precios. 24 resultados por página, 6 columnas en desktop."
    meta={`${totalItems} resultados`}
  />

  <FiltersBar
    categorias={categorias}
    bind:search
    bind:categoria
    bind:disponibles
    bind:precioMin
    bind:precioMax
    loading={loading}
    on:apply={updateFilters}
    on:reset={resetFilters}
  />

  {#if loading}
    <p class="empty">Cargando resultados…</p>
  {:else if repuestos.length === 0}
    <p class="empty">No hay resultados con estos filtros.</p>
  {:else}
    <div class="grid">
      {#each repuestos as repuesto}
        <article class="card">
          <div class="media">
            <img
              src={resolveImage(repuesto)}
              alt={`Imagen de ${repuesto.nombre}`}
              loading="lazy"
              on:error={(event) => handleImageError(event, repuesto.imagen_url)}
            />
            {#if isPlaceholder(repuesto)}
              <div class="media-icon" aria-hidden="true">🖼️</div>
            {/if}
          </div>
          <div class="card-body">
            <h3>{repuesto.nombre}</h3>
            <p class="desc">{repuesto.descripcion}</p>
            <div class="price-row">
              <p class="price">{formatCurrency(repuesto.precio)}</p>
              <span class={`pill status ${repuesto.disponible ? 'ok' : 'bad'}`}>
                {repuesto.disponible ? 'Disponible' : 'Agotado'}
              </span>
            </div>
            <div class="meta">
              <span class="muted">Stock: {repuesto.stock ?? 0}</span>
            </div>
          </div>
          <button class="primary full" disabled={!repuesto.disponible} on:click={() => addToCart(repuesto)}>
            {repuesto.disponible ? 'Añadir al carrito' : 'No disponible'}
          </button>
        </article>
      {/each}
    </div>

    {#if totalPages > 1}
      <div class="pagination bottom">
        <button
          class="ghost"
          disabled={page === 1 || loading}
          on:click={() => page > 1 && fetchPage(page - 1)}
        >
          Anterior
        </button>
        <span>Página {page} de {totalPages}</span>
        <button
          class="ghost"
          disabled={page === totalPages || loading}
          on:click={() => page < totalPages && fetchPage(page + 1)}
        >
          Siguiente
        </button>
      </div>
    {/if}
  {/if}
</section>

<button class="cart-fab" on:click={() => (showCart = !showCart)} aria-label="Ver carrito">
  🛒
  {#if cart.length}
    <span class="badge">{cart.length}</span>
  {/if}
</button>

{#if showCart}
  <aside class="cart">
    <header>
      <h2>Carrito</h2>
      <button class="ghost" on:click={() => (showCart = false)}>Cerrar</button>
    </header>
    {#if cart.length === 0}
      <p class="empty">Aún no tienes productos.</p>
    {:else}
      <ul>
        {#each cart as item}
          <li>
            <div>
              <p>{item.repuesto.nombre}</p>
              <small>{formatCurrency(item.repuesto.precio)}</small>
            </div>
            <button class="ghost" on:click={() => removeFromCart(item.repuesto.id)}>Quitar</button>
          </li>
        {/each}
      </ul>
      <div class="cart-total">
        <p>Total para cotización</p>
        <strong>
          {formatCurrency(cart.reduce((sum, item) => sum + Number(item.repuesto.precio) * item.cantidad, 0))}
        </strong>
      </div>
      <a class="primary full btn" href="/cotizacion">Solicitar cotización</a>
    {/if}
  </aside>
{/if}

<style>
  .page {
    max-width: 1600px;
    width: 100%;
    margin: 32px auto 120px;
    padding: 0 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    color: var(--ink-2);
  }

  button,
  .btn {
    cursor: pointer;
    border: none;
    border-radius: 10px;
    padding: 10px 14px;
    font-weight: 600;
    transition: transform 120ms ease, box-shadow 120ms ease, opacity 120ms ease;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  button:hover:not(:disabled),
  .btn:hover {
    transform: translateY(-1px);
  }

  .primary {
    background: linear-gradient(135deg, var(--accent), var(--accent-2));
    color: #0d0f10;
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.15);
  }

  .ghost {
    background: transparent;
    color: var(--ink-2);
    border: 1px solid var(--border);
  }

  .ghost.disabled {
    opacity: 0.5;
    pointer-events: none;
  }

  .grid {
    display: grid;
    gap: 16px;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }

  @media (min-width: 1100px) {
    .grid {
      grid-template-columns: repeat(5, minmax(0, 1fr));
    }
  }

  @media (min-width: 1280px) {
    .grid {
      grid-template-columns: repeat(6, minmax(0, 1fr));
    }
  }

  .card {
    background: linear-gradient(145deg, var(--panel), var(--panel-soft));
    border: 1px solid var(--border);
    padding: 14px;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    box-shadow: var(--shadow);
  }

  .media {
    position: relative;
    width: 100%;
    aspect-ratio: 4 / 3;
    border-radius: 12px;
    overflow: hidden;
    background: var(--panel-soft);
    border: 1px solid var(--border);
    display: grid;
    place-items: center;
  }

  .media img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .media-icon {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    font-size: 26px;
    color: var(--ink-2);
    background: linear-gradient(180deg, rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.15));
    pointer-events: none;
  }

  .card-body {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .card h3 {
    margin: 0;
    font-size: 16px;
    color: var(--ink);
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .desc {
    margin: 0;
    color: var(--ink-3);
    font-size: 14px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .tag {
    position: absolute;
    top: 10px;
    left: 10px;
    padding: 4px 10px;
    border-radius: 999px;
    font-size: 12px;
    background: rgba(250, 204, 21, 0.14);
    color: var(--ink);
    border: 1px solid rgba(250, 204, 21, 0.35);
  }

  .price {
    font-size: 18px;
    color: var(--ink);
    margin: 6px 0 0;
    font-weight: 800;
  }

  .price-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }

  .meta {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: var(--ink-3);
  }

  .meta .ok {
    color: #16a34a;
  }

  .pill.status {
    padding: 4px 10px;
    border-radius: 999px;
    font-size: 12px;
    border: 1px solid var(--border);
    background: var(--panel-soft);
    color: var(--ink-2);
  }

  .pill.status.ok {
    background: rgba(22, 163, 74, 0.12);
    color: #166534;
    border-color: rgba(22, 163, 74, 0.3);
  }

  .pill.status.bad {
    background: rgba(220, 38, 38, 0.12);
    color: #991b1b;
    border-color: rgba(220, 38, 38, 0.3);
  }

  .card .full {
    width: 100%;
    margin-top: auto;
  }

  .pagination {
    display: flex;
    gap: 12px;
    align-items: center;
    flex-wrap: wrap;
  }

  .pagination.bottom {
    justify-content: center;
    margin-top: 12px;
  }

  .empty {
    color: var(--ink-3);
    text-align: center;
    padding: 40px 0;
  }

  .cart-fab {
    position: fixed;
    bottom: 24px;
    right: 24px;
    background: var(--panel);
    border: 1px solid var(--border);
    box-shadow: var(--shadow);
    width: 54px;
    height: 54px;
    display: grid;
    place-items: center;
    font-size: 20px;
    color: var(--ink);
  }

  .badge {
    position: absolute;
    top: -6px;
    right: -6px;
    background: #ef4444;
    color: #0d0f10;
    padding: 4px 8px;
    border-radius: 999px;
    font-weight: 700;
    font-size: 12px;
  }

  .cart {
    position: fixed;
    right: 24px;
    bottom: 90px;
    width: 320px;
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 16px;
    box-shadow: var(--shadow);
    display: flex;
    flex-direction: column;
    gap: 12px;
    max-height: 70vh;
    overflow: auto;
    color: var(--ink-2);
  }

  .cart header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .cart ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .cart li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: var(--panel-soft);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 10px;
  }

  .cart-total {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid var(--border);
    padding-top: 10px;
  }

  @media (max-width: 720px) {
    .page {
      margin: 16px auto 100px;
    }

    .hero {
      flex-direction: column;
      align-items: flex-start;
    }

    .hero-meta {
      align-items: flex-start;
    }

    .actions {
      justify-content: flex-start;
      flex-wrap: wrap;
    }

    .cart {
      width: calc(100% - 32px);
      right: 16px;
      left: 16px;
      bottom: 90px;
    }
  }
</style>
