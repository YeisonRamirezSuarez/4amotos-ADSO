<script lang="ts">
  import type { Categoria } from '$lib/types';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let categorias: Categoria[] = [];
  export let search = '';
  export let categoria = '';
  export let disponibles = false;
  export let precioMin: string | number = '';
  export let precioMax: string | number = '';
  export let loading = false;
  export let applyLabel = 'Aplicar filtros';
  export let resetLabel = 'Limpiar';

  const apply = () => dispatch('apply');
  const reset = () => dispatch('reset');
</script>

<div class="filters">
  <div class="search-field">
    <label for="search-input">Buscar</label>
    <input
      id="search-input"
      placeholder="Filtro por nombre o descripción"
      bind:value={search}
      on:keydown={(e) => e.key === 'Enter' && apply()}
    />
  </div>
  <div class="field">
    <label for="categoria-select">Categoría</label>
    <select id="categoria-select" bind:value={categoria}>
      <option value="">Todas</option>
      {#each categorias as cat}
        <option value={cat.id}>{cat.nombre}</option>
      {/each}
    </select>
  </div>
  <div class="field inline">
    <label class="inline-label">
      <input type="checkbox" bind:checked={disponibles} /> Disponibles
    </label>
  </div>
  <div class="field">
    <label for="precio-min">Precio mínimo</label>
    <input id="precio-min" type="number" min="0" step="500" bind:value={precioMin} />
  </div>
  <div class="field">
    <label for="precio-max">Precio máximo</label>
    <input id="precio-max" type="number" min="0" step="500" bind:value={precioMax} />
  </div>
  <div class="actions">
    <button class="primary" type="button" on:click={apply} disabled={loading}>
      {loading ? 'Aplicando...' : applyLabel}
    </button>
    <button class="ghost" type="button" on:click={reset} disabled={loading}>{resetLabel}</button>
  </div>
</div>

<style>
  .filters {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 12px;
    background: linear-gradient(145deg, var(--panel), var(--panel-soft));
    border: 1px solid var(--border);
    padding: 16px;
    border-radius: 14px;
    box-shadow: var(--shadow);
  }

  .search-field {
    grid-column: span 2;
    min-width: 240px;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  label {
    font-size: 12px;
    color: var(--ink-3);
  }

  input,
  select {
    width: 100%;
    padding: 10px 12px;
    border-radius: 10px;
    border: 1px solid var(--border);
    background: var(--panel-soft);
    color: var(--ink);
    outline: none;
    font-weight: 600;
  }

  input:focus,
  select:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(250, 204, 21, 0.2);
  }

  .field.inline {
    display: flex;
    align-items: flex-end;
  }

  .inline-label {
    display: flex;
    gap: 8px;
    align-items: center;
    font-size: 14px;
    color: var(--ink-2);
  }

  .actions {
    display: flex;
    gap: 8px;
    align-items: flex-end;
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  button {
    cursor: pointer;
    border: none;
    border-radius: 10px;
    padding: 10px 14px;
    font-weight: 700;
    transition: transform 120ms ease, box-shadow 120ms ease, opacity 120ms ease;
    display: inline-flex;
    align-items: center;
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
    background: linear-gradient(135deg, var(--accent), var(--accent-2));
    color: #0d0f10;
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.15);
  }

  .ghost {
    background: transparent;
    color: var(--ink-2);
    border: 1px solid var(--border);
  }
</style>
