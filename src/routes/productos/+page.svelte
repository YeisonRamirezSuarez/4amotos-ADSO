<script lang="ts">
  import type { PageData } from './$types';
  import type { Repuesto, Categoria } from '$lib/types';
  import { repuestosService } from '$lib/utils/pocketbase';
  import FiltersBar from '$lib/components/FiltersBar.svelte';
  import ConfirmDeleteModal from '$lib/components/ConfirmDeleteModal.svelte';
  import PageHero from '$lib/components/PageHero.svelte';

  export let data: PageData;

  const PAGE_SIZE = 24;

  let productos: Repuesto[] = data.items ?? [];
  let totalItems = data.totalItems ?? productos.length;
  let page = data.page ?? 1;
  let totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  let categorias: Categoria[] = data.categorias ?? [];
  let loading = false;
  let error = data.error ?? '';

  let search = '';
  let categoria = '';
  let disponibles = false;
  let precioMin = '';
  let precioMax = '';

  let confirmOpen = false;
  let targetId = '';
  let targetName = '';

  const pageTitle = 'Productos | 4amotos';

  const formatCurrency = (value: number | string) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(Number(value ?? 0));

  const categoriaLabel = (item: Repuesto) => {
    const expanded = (item as any)?.expand?.categoria;
    if (expanded && typeof expanded === 'object') {
      return expanded.nombre ?? expanded.name ?? item.categoria;
    }
    return item.categoria || 'Sin categoría';
  };

  const fetchProductos = async (nextPage = page) => {
    loading = true;
    error = '';
    try {
      const filters = {
        nombre: search.trim() || undefined,
        categoria: categoria || undefined,
        disponible: disponibles ? true : undefined,
        precio_min: precioMin ? Number(precioMin) : undefined,
        precio_max: precioMax ? Number(precioMax) : undefined
      };

      const res = await repuestosService.search(filters, nextPage, PAGE_SIZE);
      productos = res.items ?? [];
      totalItems = res.totalItems ?? productos.length;
      page = res.page ?? nextPage;
      totalPages = Math.max(1, Math.ceil((res.totalItems ?? productos.length) / PAGE_SIZE));
    } catch (e) {
      error = 'No pudimos cargar los productos.';
    } finally {
      loading = false;
    }
  };

  const updateFilters = () => fetchProductos(1);

  const resetFilters = () => {
    search = '';
    categoria = '';
    disponibles = false;
    precioMin = '';
    precioMax = '';
    fetchProductos(1);
  };

  const askRemove = (id: string, name: string) => {
    targetId = id;
    targetName = name;
    confirmOpen = true;
  };

  const closeConfirm = () => {
    confirmOpen = false;
    targetId = '';
    targetName = '';
  };

  const remove = async () => {
    if (!targetId) return;
    loading = true;
    try {
      await repuestosService.remove(targetId);
      await fetchProductos(page);
      closeConfirm();
    } catch (e) {
      error = 'No se pudo eliminar.';
    } finally {
      loading = false;
    }
  };
</script>

<svelte:head>
  <title>{pageTitle}</title>
</svelte:head>

  <section class="page">
    <PageHero
      eyebrow="Catálogo 4amotos"
      title="Administrar productos"
      subtitle="Mismo layout del catálogo: busca, filtra y gestiona repuestos. 24 resultados por página."
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
    {#if error}
      <p class="empty" style="color:#fca5a5;">{error}</p>
    {/if}

    {#if loading}
      <p class="empty">Cargando productos…</p>
    {:else if productos.length === 0}
      <p class="empty">No hay resultados con estos filtros.</p>
    {:else}
      <div class="grid">
        {#each productos as item}
          <article class="card">
            <div class="card-head">
              <div class="badge-pill dark">{categoriaLabel(item)}</div>
              <span class={`pill status ${item.disponible ? 'ok' : 'bad'}`}>
                {item.disponible ? 'Disponible' : 'Agotado'}
              </span>
            </div>
            <div class="card-body">
              <h3>{item.nombre}</h3>
              <p class="muted sku">{item.codigo_producto ?? 'Sin código'}</p>
              <p class="desc">{item.descripcion ?? 'Sin descripción'}</p>
              <div class="price-row">
                <p class="price">{formatCurrency(item.precio)}</p>
                <span class="muted">Stock: {item.stock ?? 0}</span>
              </div>
            </div>
            <div class="admin-actions">
              <a class="icon-btn" href={`/productos/${item.id}`} aria-label="Ver producto">
                <span class="material-icon">visibility</span>
              </a>
              <a class="icon-btn" href={`/productos/${item.id}/editar`} aria-label="Editar producto">
                <span class="material-icon">edit</span>
              </a>
              <button
                class="icon-btn danger"
                type="button"
                on:click={() => askRemove(item.id, item.nombre)}
                aria-label="Eliminar producto"
              >
                <span class="material-icon">delete</span>
              </button>
            </div>
          </article>
        {/each}
      </div>

      {#if totalPages > 1}
        <div class="pagination bottom">
          <button
            class="ghost"
            disabled={page === 1 || loading}
            on:click={() => page > 1 && fetchProductos(page - 1)}
          >
            Anterior
          </button>
          <span>Página {page} de {totalPages}</span>
          <button
            class="ghost"
            disabled={page === totalPages || loading}
            on:click={() => page < totalPages && fetchProductos(page + 1)}
          >
            Siguiente
          </button>
        </div>
      {/if}
    {/if}

    <ConfirmDeleteModal
      open={confirmOpen}
      name={targetName}
      loading={loading}
      on:cancel={closeConfirm}
      on:confirm={remove}
    />
  </section>

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

    .ghost.danger {
      color: #ef4444;
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

    .card-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
    }

    .badge-pill {
      padding: 6px 10px;
      border-radius: 999px;
      background: rgba(0, 0, 0, 0.08);
      color: var(--ink);
      font-size: 12px;
      border: 1px solid var(--border);
    }

    .badge-pill.dark {
      background: rgba(0, 0, 0, 0.18);
      color: #fff;
      border-color: rgba(255, 255, 255, 0.15);
    }

    .card-body {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    h3 {
      margin: 0;
      font-size: 18px;
    }

    .desc {
      margin: 0;
      color: var(--ink-3);
      font-size: 14px;
    }

    .price-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 10px;
    }

    .price {
      font-weight: 700;
      color: var(--ink);
    }

    .meta {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      color: var(--ink-3);
      gap: 8px;
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

    .admin-actions {
      display: inline-flex;
      gap: 8px;
      align-items: center;
    }

    .icon-btn {
      width: 38px;
      height: 38px;
      border-radius: 10px;
      border: 1px solid var(--border);
      background: rgba(255, 255, 255, 0.03);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: var(--ink);
      transition: transform 120ms ease, background 120ms ease;
      text-decoration: none;
    }

    .icon-btn:hover {
      transform: translateY(-1px);
      background: rgba(255, 255, 255, 0.06);
    }

    .icon-btn.danger {
      color: #ef4444;
    }

    .material-icon {
      font-family: 'Material Symbols Outlined';
      font-size: 20px;
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

  </style>
