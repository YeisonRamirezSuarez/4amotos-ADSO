<script lang="ts">
  import type { Categoria } from '$lib/types';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let categorias: Categoria[] = [];
  export let search = '';
  export let categoria = '';
  export let estado: 'todos' | 'disponible' | 'agotado' = 'todos';
  export let precioMin: string | number = '';
  export let precioMax: string | number = '';
  export let loading = false;
  export let applyLabel = 'Aplicar filtros';
  export let resetLabel = 'Limpiar';
  export let page = 1;
  export let totalPages = 1;
  export let pageSize = 24;
  export let totalItems = 0;
  export let visibleCount = 0;

  $: showingStart = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  $: showingEnd = totalItems === 0 ? 0 : Math.min(totalItems, showingStart + visibleCount - 1);

  const apply = () => dispatch('apply');
  const reset = () => dispatch('reset');
</script>

<div class="filters-card">
  <div class="filters-row top">
    <div class="field search">
      <span aria-hidden="true" class="material-icon">search</span>
      <input
        id="search-input"
        placeholder="Buscar por nombre o descripción"
        bind:value={search}
        on:keydown={(e) => e.key === 'Enter' && apply()}
      />
    </div>

    <button class="icon-btn" type="button" on:click={apply} aria-label="Aplicar filtros">
      <span class="material-icon">tune</span>
    </button>

    <div class="field select">
      <span class="material-icon" aria-hidden="true">category</span>
      <select id="categoria-select" bind:value={categoria}>
        <option value="">Todas las categorías</option>
        {#each categorias as cat}
          <option value={cat.id}>{cat.nombre}</option>
        {/each}
      </select>
    </div>

    <div class="field select">
      <span class="material-icon" aria-hidden="true">inventory</span>
      <select id="estado-select" bind:value={estado}>
        <option value="todos">Todos los estados</option>
        <option value="disponible">Disponibles</option>
        <option value="agotado">Agotados</option>
      </select>
    </div>

    <div class="page-chip">
      <span class="material-icon" aria-hidden="true">calendar_view_month</span>
      <span>{page} / {totalPages}</span>
    </div>
  </div>

  <div class="filters-row bottom">
    <div class="meta">
      {#if totalItems === 0}
        Sin resultados
      {:else}
        Mostrando {showingStart} - {showingEnd} de {totalItems}
      {/if}
    </div>

    <div class="field price-range">
      <span class="material-icon" aria-hidden="true">attach_money</span>
      <input
        id="precio-min"
        type="number"
        min="0"
        step="500"
        bind:value={precioMin}
        placeholder="Precio min"
      />
      <span class="dash">–</span>
      <input
        id="precio-max"
        type="number"
        min="0"
        step="500"
        bind:value={precioMax}
        placeholder="Precio max"
      />
    </div>

    <div class="actions">
      <button class="primary" type="button" on:click={apply} disabled={loading}>
        <span class="material-icon" aria-hidden="true">done_all</span>
        {loading ? 'Aplicando...' : applyLabel}
      </button>
      <button class="ghost" type="button" on:click={reset} disabled={loading}>
        <span class="material-icon" aria-hidden="true">refresh</span>
        {resetLabel}
      </button>
    </div>
  </div>
</div>

<style>
  .filters-card {
    display: flex;
    flex-direction: column;
    gap: 12px;
    background: linear-gradient(135deg, var(--panel), var(--panel-soft));
    border: 1px solid var(--border);
    padding: 16px;
    border-radius: 16px;
    box-shadow: var(--shadow);
  }

  .filters-row {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    align-items: center;
  }

  .filters-row.bottom {
    justify-content: space-between;
    gap: 12px;
  }

  .field {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    border: 1px solid var(--border);
    border-radius: 14px;
    background: var(--panel-soft);
    padding: 10px 14px;
    height: 46px;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.6);
  }

  .field input,
  .field select {
    border: none;
    background: transparent;
    outline: none;
    font-weight: 600;
    color: var(--ink);
  }

  .field select {
    padding-right: 8px;
    background: var(--panel-soft);
    color: var(--ink);
  }

  .field select option {
    background: var(--panel);
    color: var(--ink);
  }

  .search {
    flex: 1;
    min-width: 260px;
  }

  .select {
    min-width: 190px;
  }

  .price-range {
    flex: 1;
    min-width: 320px;
    justify-content: flex-start;
  }

  .dash {
    color: #9ca3af;
  }

  .actions {
    display: flex;
    gap: 8px;
    align-items: center;
    flex-wrap: wrap;
  }

  button {
    cursor: pointer;
    border: none;
    border-radius: 12px;
    padding: 10px 16px;
    height: 46px;
    font-weight: 800;
    transition: transform 120ms ease, box-shadow 120ms ease, opacity 120ms ease;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    justify-content: center;
  }

  button:hover:not(:disabled) {
    transform: translateY(-1px);
  }

  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .primary {
    background: linear-gradient(135deg, #fbbf24, #f59e0b);
    color: #ffffff;
    box-shadow: none;
    border: 1px solid #f59e0b;
  }

  .ghost {
    background: var(--panel-soft);
    color: var(--ink-2);
    border: 1px solid var(--border);
  }

  .icon-btn {
    width: 46px;
    height: 46px;
    border-radius: 12px;
    border: 1px solid var(--border);
    background: var(--panel-soft);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--ink-2);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.6);
  }

  .icon-btn:hover {
    background: rgba(255, 255, 255, 0.08);
  }

  .material-icon {
    font-family: 'Material Symbols Outlined';
    font-size: 18px;
    line-height: 1;
  }

  .page-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 10px 12px;
    height: 46px;
    border-radius: 12px;
    background: var(--panel-soft);
    color: var(--ink-2);
    font-weight: 700;
    border: 1px solid var(--border);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.6);
  }

  .meta {
    color: var(--ink-3);
    font-size: 13px;
    font-weight: 700;
    padding: 0 6px;
  }
</style>
