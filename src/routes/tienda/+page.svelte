<script lang="ts">
  import type { PageData } from './$types';
  import type { CartItem, Repuesto } from '$lib/types';
  import { repuestosService } from '$lib/utils/pocketbase';
  import { cartStore } from '$lib/stores/cart';
  import PageHero from '$lib/components/PageHero.svelte';

  type Chip = { key: string; label: string; clear: () => void };
  type PriceFacet = { id: string; label: string; min: number | null; max: number | null; count: number };
  type CategoryFacet = { id: string; label: string; count: number };

  export let data: PageData;

  let pageSize = data.perPage ?? 10;

  const sortMap: Record<string, string | undefined> = {
    relevancia: undefined,
    precio_asc: '+precio',
    precio_desc: '-precio',
    recientes: '-created',
    antiguos: '+created'
  };

  let search = data.search ?? '';
  let categoria = data.categoria ?? '';
  let categoriaNombre = data.categoriaNombre ?? '';
  let marca = data.marca ?? '';
  let disponibles = data.disponibles ?? false;
  let orden = data.orden ?? 'relevancia';
  let page = data.page ?? 1;
  let precioMin = data.precioMin ?? '';
  let precioMax = data.precioMax ?? '';

  let repuestos: Repuesto[] = data.repuestos?.items ?? [];
  let totalItems = data.repuestos?.totalItems ?? 0;
  let totalPages = data.repuestos?.totalPages ?? 1;
  let categorias = data.categorias ?? [];
  let brandFacets = (data.brandFacets ?? []) as { label: string; count: number }[];
  let priceFacets = (data.priceFacets ?? []) as PriceFacet[];
  let categoryFacets = (data.categoryFacets ?? []) as CategoryFacet[];
  let activeChips: Chip[] = [];
  let loading = false;

  let cart: CartItem[] = [];
  let showCart = false;
  let brokenImages = new Set<string>();
  const placeholderImage = '/placeholder-product.svg';

  $: cart = $cartStore;

  const formatCurrency = (value: number | string) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(Number(value));

  const findCategoryLabel = (id: string) => categorias.find((cat) => cat.id === id)?.nombre ?? 'Categoría';

  const updateUrl = () => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (categoria) {
      params.set('categoria', categoria);
    } else if (categoriaNombre) {
      params.set('categoriaNombre', categoriaNombre);
    }
    if (marca) params.set('marca', marca);
    if (disponibles) params.set('disponibles', 'true');
    if (precioMin) params.set('precioMin', String(precioMin));
    if (precioMax) params.set('precioMax', String(precioMax));
    if (orden && orden !== 'relevancia') params.set('orden', orden);
    if (page > 1) params.set('page', String(page));
    const url = `${window.location.pathname}?${params.toString()}`;
    history.replaceState({}, '', url);
  };

  const buildFilters = () => ({
    nombre: search.trim() || undefined,
    categoria: categoria || undefined,
    categoriaNombre: !categoria && categoriaNombre ? categoriaNombre : undefined,
    disponible: disponibles ? true : undefined,
    precio_min: precioMin ? Number(precioMin) : undefined,
    precio_max: precioMax ? Number(precioMax) : undefined,
    marca: marca || undefined,
    sort: sortMap[orden]
  });

  async function applyFilters(nextPage = 1) {
    loading = true;
    try {
      const res = await repuestosService.search(buildFilters(), nextPage, pageSize);
      repuestos = res.items ?? [];
      totalItems = res.totalItems ?? repuestos.length;
      page = res.page ?? nextPage;
      totalPages = Math.max(1, Math.ceil((res.totalItems ?? repuestos.length) / pageSize));
      updateUrl();
    } finally {
      loading = false;
    }
  }

  function resetFilters() {
    search = '';
    categoria = '';
    categoriaNombre = '';
    marca = '';
    disponibles = false;
    precioMin = '';
    precioMax = '';
    orden = 'relevancia';
    applyFilters(1);
  }

  function setPage(next: number) {
    if (next < 1 || next > totalPages) return;
    applyFilters(next);
  }

  function setPriceBucket(id: string) {
    const bucket = priceFacets.find((p) => p.id === id);
    if (!bucket) return;
    precioMin = bucket.min ?? '';
    precioMax = bucket.max ?? '';
    applyFilters(1);
  }

  $: selectedPriceBucket =
    priceFacets.find(
      (p) => String(p.min ?? '') === String(precioMin ?? '') && String(p.max ?? '') === String(precioMax ?? '')
    )?.id || '';

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

  const installmentText = (value: number | string) => {
    const per = Number(value) / 36;
    if (!Number.isFinite(per) || per <= 0) return '';
    return `36 cuotas de ${formatCurrency(per)}`;
  };

  const sortOptions = [
    { value: 'relevancia', label: 'Más relevantes' },
    { value: 'precio_asc', label: 'Menor precio' },
    { value: 'precio_desc', label: 'Mayor precio' },
    { value: 'recientes', label: 'Más recientes' },
    { value: 'antiguos', label: 'Más antiguos' }
  ];

  $: activeChips = (
    [
      search && { key: 'search', label: `Búsqueda: ${search}`, clear: () => { search = ''; applyFilters(1); } },
      categoria && {
        key: 'categoria',
        label: `Categoría: ${findCategoryLabel(categoria)}`,
        clear: () => {
          categoria = '';
          categoriaNombre = '';
          applyFilters(1);
        }
      },
      !categoria && categoriaNombre && {
        key: 'categoriaNombre',
        label: `Categoría: ${categoriaNombre}`,
        clear: () => {
          categoriaNombre = '';
          applyFilters(1);
        }
      },
      marca && { key: 'marca', label: `Marca: ${marca}`, clear: () => { marca = ''; applyFilters(1); } },
      (precioMin || precioMax) && {
        key: 'precio',
        label: `Precio ${precioMin ? `desde ${formatCurrency(precioMin)}` : ''}${precioMax ? ` hasta ${formatCurrency(precioMax)}` : ''}`.trim(),
        clear: () => {
          precioMin = '';
          precioMax = '';
          applyFilters(1);
        }
      },
      disponibles && {
        key: 'disponibles',
        label: 'Solo disponibles',
        clear: () => {
          disponibles = false;
          applyFilters(1);
        }
      }
    ].filter(Boolean) as Chip[]
  );
</script>

<svelte:head>
  <title>Tienda | 4amotos</title>
</svelte:head>

<section class="page">
  <div class="crumbs">
    <span>Accesorios para Vehículos</span>
    <span class="arrow">›</span>
    <span>Lubricantes y fluidos</span>
  </div>

  <div class="layout">
    <aside class="sidebar">
      <header class="sidebar-head">
        <h2>Filtros</h2>
        <button class="ghost sm" type="button" on:click={resetFilters} disabled={loading}>Limpiar todo</button>
      </header>

      <div class="filter-group">
        <label class="label" for="search">Buscar</label>
        <input
          id="search"
          class="input"
          placeholder="Productos, marcas o palabras clave"
          bind:value={search}
          on:keydown={(e) => e.key === 'Enter' && applyFilters(1)}
        />
      </div>

      <div class="filter-group">
        <div class="group-title">Categorías</div>
        <div class="pill-list">
          {#if categoryFacets.length === 0}
            <p class="muted">Sin categorías registradas.</p>
          {:else}
            {#each categoryFacets as cat}
              <button
                type="button"
                class={`pill ${categoria === cat.id ? 'active' : ''}`}
                on:click={() => {
                  categoria = categoria === cat.id ? '' : cat.id;
                  categoriaNombre = '';
                  applyFilters(1);
                }}
              >
                <span>{cat.label}</span>
                <span class="count">{cat.count}</span>
              </button>
            {/each}
          {/if}
        </div>
      </div>

      <div class="filter-group">
        <div class="group-title">Precio rápido</div>
        <div class="pill-list">
          {#each priceFacets as bucket}
            <button
              type="button"
              class={`pill ${selectedPriceBucket === bucket.id ? 'active' : ''}`}
              on:click={() => setPriceBucket(bucket.id)}
            >
              <span>{bucket.label}</span>
              <span class="count">{bucket.count}</span>
            </button>
          {/each}
        </div>
        <div class="price-row">
          <input
            class="input"
            type="number"
            min="0"
            step="500"
            placeholder="Mín"
            bind:value={precioMin}
          />
          <span class="dash">—</span>
          <input
            class="input"
            type="number"
            min="0"
            step="500"
            placeholder="Máx"
            bind:value={precioMax}
          />
          <button class="ghost sm" type="button" on:click={() => applyFilters(1)} disabled={loading}>Aplicar</button>
        </div>
      </div>

      <div class="filter-group">
        <div class="group-title">Marca</div>
        <div class="pill-list">
          {#if brandFacets.length === 0}
            <p class="muted">Sin marcas registradas.</p>
          {:else}
            {#each brandFacets as item}
              <button
                type="button"
                class={`pill ${marca === item.label ? 'active' : ''}`}
                on:click={() => {
                  marca = marca === item.label ? '' : item.label;
                  applyFilters(1);
                }}
              >
                <span>{item.label}</span>
                <span class="count">{item.count}</span>
              </button>
            {/each}
          {/if}
        </div>
      </div>

      <div class="filter-group inline">
        <label class="toggle">
          <input type="checkbox" bind:checked={disponibles} on:change={() => applyFilters(1)} />
          <span>Solo disponibles</span>
        </label>
      </div>

      <div class="filter-actions">
        <button class="primary full" type="button" on:click={() => applyFilters(1)} disabled={loading}>Ver resultados</button>
        <button class="ghost full" type="button" on:click={resetFilters} disabled={loading}>Limpiar</button>
      </div>
    </aside>

    <div class="content">
      <div class="topbar">
        <div>
          <p class="eyebrow">Listado</p>
          <h2>{totalItems} resultados</h2>
          <p class="muted">Página {page} de {totalPages}</p>
        </div>
        <div class="top-actions">
          <div class="chips">
            {#if activeChips.length === 0}
              <span class="muted">Sin filtros activos</span>
            {:else}
              {#each activeChips as chip}
                <button class="chip" type="button" on:click={chip.clear}>
                  <span>{chip.label}</span>
                  <span aria-hidden="true">×</span>
                </button>
              {/each}
            {/if}
          </div>
          <label class="sorter">
            <span>Ordenar por</span>
            <select bind:value={orden} on:change={() => applyFilters(1)}>
              {#each sortOptions as opt}
                <option value={opt.value}>{opt.label}</option>
              {/each}
            </select>
          </label>
        </div>
      </div>

      {#if loading}
        <p class="empty">Cargando resultados…</p>
      {:else if repuestos.length === 0}
        <div class="empty-box">
          <p>No hay resultados con estos filtros.</p>
          <button class="ghost" type="button" on:click={resetFilters}>Reiniciar filtros</button>
        </div>
      {:else}
        <div class="list">
          {#each repuestos as repuesto}
            <article class="card row">
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
                <p class="category-label">{findCategoryLabel(repuesto.categoria)}</p>
                <h3>{repuesto.nombre}</h3>
                <p class="desc">{repuesto.descripcion}</p>
                <div class="meta">
                  <span class="muted">Stock: {repuesto.stock ?? 0}</span>
                  {#if repuesto.marca}<span class="muted">{repuesto.marca}</span>{/if}
                </div>
              </div>
              <div class="cta-col">
                <div class="price-col">
                  <p class="price">{formatCurrency(repuesto.precio)}</p>
                  <p class="installments">{installmentText(repuesto.precio)}</p>
                  <span class={`pill status ${repuesto.disponible ? 'ok' : 'bad'}`}>
                    {repuesto.disponible ? 'Disponible' : 'Agotado'}
                  </span>
                </div>
                <button class="outline" disabled={!repuesto.disponible} on:click={() => addToCart(repuesto)}>
                  {repuesto.disponible ? 'Agregar al carrito' : 'No disponible'}
                </button>
              </div>
            </article>
          {/each}
        </div>

        {#if totalPages > 1}
          <div class="pagination bottom">
            <button class="ghost" disabled={page === 1 || loading} on:click={() => setPage(page - 1)}>
              Anterior
            </button>
            <span>Página {page} de {totalPages}</span>
            <button class="ghost" disabled={page === totalPages || loading} on:click={() => setPage(page + 1)}>
              Siguiente
            </button>
          </div>
        {/if}
      {/if}
      
      <section class="subscribe">
        <div>
          <h3>Suscríbete y entérate de todo</h3>
          <p>Escribe tu e-mail y aprovecha este descuento en tu primera compra.</p>
        </div>
        <form class="subscribe-form" on:submit|preventDefault={() => {}}>
          <input type="email" placeholder="Escribe tu correo electrónico" required />
          <button type="submit" class="primary">Enviar</button>
          <small>Al suscribirte aceptas nuestros <a href="/p/privacidad">términos y condiciones</a>.</small>
        </form>
      </section>

    </div>
  </div>
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
    max-width: 1200px;
    width: 100%;
    margin: 20px auto 0;
    padding: 0 0 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    color: var(--ink-2);
    background: var(--bg);
  }

  .crumbs {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: var(--ink-3);
    padding: 0 4px;
  }

  .crumbs .arrow {
    color: var(--ink-3);
  }

  .layout {
    display: grid;
    gap: 12px;
    grid-template-columns: 260px 1fr;
    align-items: start;
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
    background: var(--panel);
    color: var(--ink-2);
    border: 1px solid var(--border);
  }

  .ghost.disabled {
    opacity: 0.5;
    pointer-events: none;
  }

  .sidebar {
    background: var(--panel);
    border: 1px solid var(--border);
    padding: 14px;
    border-radius: 10px;
    box-shadow: var(--shadow);
    position: sticky;
    top: 12px;
  }

  .sidebar-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 8px;
  }

  .filter-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 10px 0;
    border-bottom: 1px solid var(--border);
  }

  .filter-group:last-child {
    border-bottom: none;
  }

  .group-title {
    font-weight: 700;
    color: var(--ink);
    margin: 0;
  }

  .label {
    font-size: 12px;
    color: var(--ink-3);
  }

  .input {
    width: 100%;
    padding: 8px 10px;
    border-radius: 8px;
    border: 1px solid var(--border);
    background: var(--panel-soft);
    color: var(--ink);
    outline: none;
    font-weight: 600;
  }

  .input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(250, 204, 21, 0.2);
  }

  .pill-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .pill {
    border: 1px solid var(--border);
    border-radius: 999px;
    padding: 6px 10px;
    background: var(--panel);
    color: var(--ink);
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: all 120ms ease;
  }

  .pill .count {
    background: var(--panel-soft);
    border-radius: 999px;
    padding: 2px 8px;
    font-weight: 700;
    font-size: 12px;
  }

  .pill.active {
    background: linear-gradient(135deg, var(--accent), var(--accent-2));
    border-color: var(--accent);
    color: #0d0f10;
  }

  .price-row {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .dash {
    color: var(--ink-3);
  }

  .toggle {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-weight: 600;
    color: var(--ink);
  }

  .filter-actions {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-top: 8px;
  }

  .full {
    width: 100%;
  }

  .content {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .topbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 10px 12px;
    box-shadow: var(--shadow);
  }

  .top-actions {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  .chips {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    max-width: 720px;
  }

  .chip {
    border: 1px solid var(--border);
    background: var(--panel-soft);
    border-radius: 999px;
    padding: 6px 12px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: var(--ink-2);
  }

  .sorter {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 700;
    color: var(--ink-2);
  }

  .sorter select {
    padding: 8px 10px;
    border-radius: 10px;
    border: 1px solid var(--border);
    background: var(--panel-soft);
    color: var(--ink);
  }

  .list {
    display: grid;
    gap: 10px;
  }

  .card {
    background: var(--panel);
    border: 1px solid var(--border);
    padding: 14px 16px;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    box-shadow: var(--shadow);
    transition: transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease;
  }

  .card.row {
    display: grid;
    grid-template-columns: 140px 1fr 170px;
    gap: 12px;
    align-items: center;
    min-height: 160px;
  }

  .card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow);
    border-color: color-mix(in srgb, var(--border) 60%, var(--ink) 20%);
  }

  .media {
    position: relative;
    width: 100%;
    aspect-ratio: 3 / 4;
    max-width: 130px;
    border-radius: 6px;
    overflow: hidden;
    background: var(--panel-soft);
    border: 1px solid var(--border);
    display: grid;
    place-items: center;
    margin: 0 auto;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
  }

  .media.small {
    aspect-ratio: 1;
  }

  .media img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
    padding: 10px;
  }

  .media-icon {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    font-size: 26px;
    color: var(--ink-2);
    background: color-mix(in srgb, var(--ink) 6%, transparent);
    pointer-events: none;
  }

  .card-body {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .category-label {
    margin: 0;
    color: var(--ink-3);
    font-size: 11px;
  }

  .card h3 {
    margin: 0;
    font-size: 15.5px;
    color: var(--ink);
    line-height: 1.32;
    font-weight: 700;
  }

  .desc {
    margin: 0;
    color: var(--ink-3);
    font-size: 12.5px;
    line-height: 1.45;
  }

  .price-col {
    display: flex;
    flex-direction: column;
    gap: 4px;
    align-items: flex-start;
  }

  .price {
    font-size: 18.5px;
    color: var(--ink);
    margin: 0;
    font-weight: 800;
  }

  .installments {
    margin: 0;
    font-size: 11px;
    color: var(--ink-3);
  }

  .meta {
    display: flex;
    gap: 10px;
    font-size: 11px;
    color: var(--ink-3);
    flex-wrap: wrap;
  }

  .cta-col {
    display: grid;
    gap: 8px;
    justify-items: end;
    align-content: center;
  }

  .pill.status {
    padding: 4px 10px;
    border-radius: 999px;
    font-size: 11px;
    border: 1px solid var(--border);
    background: var(--panel-soft);
    color: var(--ink-2);
  }

  .pill.status.ok {
    background: #22c55e;
    color: #0b0f10;
    border-color: color-mix(in srgb, #14532d 60%, var(--border) 40%);
  }

  .pill.status.bad {
    background: #ef4444;
    color: #0b0f10;
    border-color: color-mix(in srgb, #7f1d1d 60%, var(--border) 40%);
  }

  .outline {
    background: linear-gradient(180deg, #fde68a, #facc15);
    color: var(--ink);
    border: 1.5px solid color-mix(in srgb, var(--ink) 70%, transparent);
    width: 180px;
    font-weight: 800;
    height: 42px;
    letter-spacing: 0.01em;
    border-radius: 10px;
    box-shadow: var(--shadow);
    transition: transform 140ms ease, box-shadow 140ms ease, filter 140ms ease;
  }

  .outline:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 12px 26px rgba(0, 0, 0, 0.1);
    filter: brightness(0.97);
  }

  .outline:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.1);
  }

  .outline:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    border-color: var(--border);
    color: var(--ink-3);
    box-shadow: none;
    background: var(--panel-soft);
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

  .empty-box {
    border: 1px solid var(--border);
    background: var(--panel);
    padding: 24px;
    border-radius: 14px;
    text-align: center;
    color: var(--ink-2);
    display: grid;
    gap: 12px;
    place-items: center;
  }

  .info-banner {
    border: 1px solid color-mix(in srgb, var(--accent) 40%, var(--border) 60%);
    padding: 10px 12px;
    border-radius: 6px;
    color: var(--ink);
    text-align: center;
    background: color-mix(in srgb, var(--accent) 12%, var(--panel) 88%);
    font-size: 12px;
  }

  .subscribe {
    display: grid;
    grid-template-columns: 1.2fr 1fr;
    gap: 16px;
    align-items: center;
    padding: 16px;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--panel);
    box-shadow: var(--shadow);
  }

  .subscribe h3 {
    margin: 0 0 6px;
  }

  .subscribe p {
    margin: 0;
    color: var(--ink-3);
  }

  .subscribe-form {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 8px;
    align-items: center;
  }

  .subscribe-form input {
    padding: 10px 12px;
    border-radius: 8px;
    border: 1px solid var(--border);
    background: var(--panel-soft);
    color: var(--ink);
  }

  .subscribe-form small {
    grid-column: span 2;
    color: var(--ink-3);
  }

  .subscribe-form a {
    color: var(--ink);
    text-decoration: underline;
  }

  .store-footer {
    background: linear-gradient(120deg, var(--footer-bg-1), var(--footer-bg-2));
    border-radius: 8px;
    padding: 20px;
    color: var(--footer-ink);
    display: grid;
    gap: 14px;
  }

  .footer-columns {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 16px;
  }

  .footer-links {
    display: grid;
    gap: 6px;
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
    z-index: 10;
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

  @media (max-width: 1024px) {
    .layout {
      grid-template-columns: 1fr;
    }

    .sidebar {
      position: static;
    }

    .topbar {
      align-items: flex-start;
    }

    .subscribe {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 720px) {
    .page {
      margin: 16px auto 100px;
    }

    .chips {
      width: 100%;
    }

    .cart {
      width: calc(100% - 32px);
      right: 16px;
      left: 16px;
      bottom: 90px;
    }

    .subscribe-form {
      grid-template-columns: 1fr;
    }
  }
</style>
