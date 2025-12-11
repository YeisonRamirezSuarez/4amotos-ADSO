<script lang="ts">
  import type { PageData } from './$types';
  import { repuestosService } from '$lib/utils/pocketbase';
  import { goto } from '$app/navigation';

  export let data: PageData;
  const categorias = data.categorias ?? [];

  let form = {
    nombre: '',
    descripcion: '',
    precio: 0,
    categoria: '',
    stock: 0,
    disponible: true,
    imagen_url: '',
    marca: '',
    codigo_producto: ''
  };

  let loading = false;
  let message = '';
  let error = '';
  let fieldErrors: Record<string, string> = {};

  const pageTitle = 'Nuevo producto | 4amotos';

  const submit = async () => {
    loading = true;
    message = '';
    error = '';
    fieldErrors = {};
    try {
      if (!form.nombre || !form.codigo_producto) {
        error = 'Nombre y código de producto son obligatorios.';
        return;
      }

      const payload = {
        ...form,
        precio: Number(form.precio) || 0,
        stock: Number(form.stock) || 0
      };

      await repuestosService.create(payload);
      message = 'Producto creado.';
      setTimeout(() => goto('/productos'), 700);
    } catch (e: unknown) {
      const err = e as any;
      // PocketBase suele mandar errores en err.response.data.data
      const data = err?.response?.data?.data || err?.data || {};
      const topMessage = err?.response?.message || err?.response?.data?.message || err?.message || '';

      const keys = Object.keys(data);
      keys.forEach((k) => {
        const msg = data[k]?.message ?? 'Inválido';
        fieldErrors[k] = msg;
      });

      const firstKey = keys[0];
      const msg = firstKey ? `${firstKey}: ${data[firstKey]?.message ?? 'Inválido'}` : '';
      error = msg || topMessage || 'No se pudo crear el producto (validación).';

      if (!msg && !topMessage) {
        // Último recurso: mostrar todo el objeto
        error = 'Error: ' + JSON.stringify(err?.response ?? err);
      }
      if (!msg && !topMessage && e instanceof Error) {
        error = e.message;
      }
    } finally {
      loading = false;
    }
  };
</script>

<svelte:head>
  <title>{pageTitle}</title>
</svelte:head>

<section class="panel" style="margin:20px auto 120px; max-width:1200px; width:100%; display:flex; flex-direction:column; gap:1.25rem;">
  <div style="display:flex; align-items:center; justify-content:space-between; gap:1rem; flex-wrap:wrap;">
    <div>
      <p class="pill">Nuevo producto</p>
      <h1 style="margin:0.2rem 0 0;">Agregar inventario</h1>
      <p class="muted" style="margin:0.35rem 0 0;">Completa los campos y publica al instante.</p>
    </div>
    <a href="/productos"><button class="secondary">Volver al catálogo</button></a>
  </div>

  {#if error}
    <p class="muted" style="color:#fca5a5;">{error}</p>
  {/if}
  {#if message}
    <p class="muted" style="color:#bbf7d0;">{message}</p>
  {/if}

  <div class="grid cols-2" style="gap:1rem;">
    <label class="field">
      <span>Nombre*</span>
      <input class:error={fieldErrors.nombre} bind:value={form.nombre} placeholder="Ej: Pastillas freno" />
      {#if fieldErrors.nombre}<small class="field-error">{fieldErrors.nombre}</small>{/if}
    </label>
    <label class="field">
      <span>Código*</span>
      <input class:error={fieldErrors.codigo_producto} bind:value={form.codigo_producto} placeholder="Ej: PF-123" />
      {#if fieldErrors.codigo_producto}<small class="field-error">{fieldErrors.codigo_producto}</small>{/if}
    </label>
    <label class="field">
      <span>Precio</span>
      <input class:error={fieldErrors.precio} type="number" min="0" step="100" bind:value={form.precio} />
      {#if fieldErrors.precio}<small class="field-error">{fieldErrors.precio}</small>{/if}
    </label>
    <label class="field">
      <span>Stock</span>
      <input class:error={fieldErrors.stock} type="number" min="0" step="1" bind:value={form.stock} />
      {#if fieldErrors.stock}<small class="field-error">{fieldErrors.stock}</small>{/if}
    </label>
    <label class="field">
      <span>Categoría</span>
      <select class:error={fieldErrors.categoria} bind:value={form.categoria}>
        <option value="">Sin categoría</option>
        {#each categorias as cat}
          <option value={cat.id}>{cat.nombre}</option>
        {/each}
      </select>
      {#if fieldErrors.categoria}<small class="field-error">{fieldErrors.categoria}</small>{/if}
    </label>
    <label class="field" style="display:flex; align-items:center; gap:0.5rem;">
      <input type="checkbox" bind:checked={form.disponible} /> Disponible
    </label>
    <label class="field">
      <span>Marca</span>
      <input class:error={fieldErrors.marca} bind:value={form.marca} placeholder="Ej: Yamaha" />
      {#if fieldErrors.marca}<small class="field-error">{fieldErrors.marca}</small>{/if}
    </label>
    <label class="field">
      <span>Imagen URL</span>
      <input class:error={fieldErrors.imagen_url} bind:value={form.imagen_url} placeholder="https://..." />
      {#if fieldErrors.imagen_url}<small class="field-error">{fieldErrors.imagen_url}</small>{/if}
    </label>
  </div>

  <label class="field">
    <span>Descripción</span>
    <textarea class:error={fieldErrors.descripcion} rows="4" bind:value={form.descripcion} placeholder="Detalles breves del repuesto"></textarea>
    {#if fieldErrors.descripcion}<small class="field-error">{fieldErrors.descripcion}</small>{/if}
  </label>

  <div style="display:flex; gap:0.75rem;">
    <button type="button" on:click={submit} disabled={loading}>{loading ? 'Guardando...' : 'Publicar producto'}</button>
    <button type="button" class="secondary" on:click={() => (form = { ...form, nombre: '', descripcion: '', precio: 0, stock: 0, imagen_url: '', marca: '', codigo_producto: '' })}>
      Limpiar
    </button>
  </div>
</section>

<style>
  .field {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    color: var(--ink-2);
  }

  .field span {
    font-weight: 600;
    color: var(--ink);
  }

  input.error,
  select.error,
  textarea.error {
    border-color: #f87171;
    box-shadow: 0 0 0 1px rgba(248, 113, 113, 0.4);
  }

  .field-error {
    color: #fca5a5;
    font-size: 0.9rem;
  }
</style>
