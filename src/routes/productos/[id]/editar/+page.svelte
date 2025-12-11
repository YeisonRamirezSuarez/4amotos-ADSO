<script lang="ts">
  import type { PageData } from './$types';
  import { repuestosService } from '$lib/utils/pocketbase';
  import { goto } from '$app/navigation';
  import ConfirmDeleteModal from '$lib/components/ConfirmDeleteModal.svelte';

  export let data: PageData;
  const categorias = data.categorias ?? [];
  const producto = data.producto;

  let form = {
    nombre: producto?.nombre ?? '',
    descripcion: producto?.descripcion ?? '',
    precio: producto?.precio ?? 0,
    categoria: producto?.categoria ?? '',
    stock: producto?.stock ?? 0,
    disponible: producto?.disponible ?? true,
    imagen_url: producto?.imagen_url ?? '',
    marca: producto?.marca ?? '',
    codigo_producto: producto?.codigo_producto ?? ''
  };

  let loading = false;
  let message = '';
  let error = '';
  let fieldErrors: Record<string, string> = {};
  let confirmOpen = false;

  const submit = async () => {
    loading = true;
    message = '';
    error = '';
    fieldErrors = {};
    try {
      const payload = {
        ...form,
        precio: Number(form.precio) || 0,
        stock: Number(form.stock) || 0
      };
      await repuestosService.update(producto.id, payload);
      message = 'Producto actualizado.';
      setTimeout(() => goto('/productos'), 700);
    } catch (e: unknown) {
      const err = e as any;
      const data = err?.response?.data?.data || err?.data || {};
      const topMessage = err?.response?.message || err?.response?.data?.message || err?.message || '';
      const keys = Object.keys(data);
      keys.forEach((k) => {
        const msg = data[k]?.message ?? 'Inválido';
        fieldErrors[k] = msg;
      });
      const firstKey = keys[0];
      const msg = firstKey ? `${firstKey}: ${data[firstKey]?.message ?? 'Inválido'}` : '';
      error = msg || topMessage || 'No se pudo actualizar el producto.';
      if (!msg && !topMessage) {
        error = 'Error: ' + JSON.stringify(err?.response ?? err);
      }
    } finally {
      loading = false;
    }
  };

  const openConfirm = () => {
    confirmOpen = true;
  };

  const closeConfirm = () => {
    confirmOpen = false;
  };

  const remove = async () => {
    loading = true;
    error = '';
    confirmOpen = false;
    try {
      await repuestosService.remove(producto.id);
      message = 'Producto eliminado.';
      setTimeout(() => goto('/productos'), 600);
    } catch (e) {
      error = 'No se pudo eliminar el producto.';
    } finally {
      loading = false;
    }
  };
</script>

<svelte:head>
  <title>Editar {producto?.nombre} | 4amotos</title>
</svelte:head>

<section class="panel" style="margin-top:1rem; display:flex; flex-direction:column; gap:1.25rem;">
  <div style="display:flex; align-items:center; justify-content:space-between; gap:1rem; flex-wrap:wrap;">
    <div>
      <p class="pill">Editar producto</p>
      <h1 style="margin:0.2rem 0 0;">{producto?.nombre}</h1>
      <p class="muted" style="margin:0.35rem 0 0;">Actualiza los campos y guarda.</p>
    </div>
    <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
      <a href="/productos"><button class="secondary">Volver</button></a>
      <button type="button" class="secondary" on:click={openConfirm} disabled={loading}>Eliminar</button>
    </div>
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
      <input class:error={fieldErrors.nombre} bind:value={form.nombre} />
      {#if fieldErrors.nombre}<small class="field-error">{fieldErrors.nombre}</small>{/if}
    </label>
    <label class="field">
      <span>Código*</span>
      <input class:error={fieldErrors.codigo_producto} bind:value={form.codigo_producto} />
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
      <input class:error={fieldErrors.marca} bind:value={form.marca} />
      {#if fieldErrors.marca}<small class="field-error">{fieldErrors.marca}</small>{/if}
    </label>
    <label class="field">
      <span>Imagen URL</span>
      <input class:error={fieldErrors.imagen_url} bind:value={form.imagen_url} />
      {#if fieldErrors.imagen_url}<small class="field-error">{fieldErrors.imagen_url}</small>{/if}
    </label>
  </div>

  <label class="field">
    <span>Descripción</span>
    <textarea class:error={fieldErrors.descripcion} rows="4" bind:value={form.descripcion}></textarea>
    {#if fieldErrors.descripcion}<small class="field-error">{fieldErrors.descripcion}</small>{/if}
  </label>

  <div style="display:flex; gap:0.75rem;">
    <button type="button" on:click={submit} disabled={loading}>{loading ? 'Guardando...' : 'Guardar cambios'}</button>
  </div>

  <ConfirmDeleteModal
    open={confirmOpen}
    name={producto?.nombre}
    loading={loading}
    on:cancel={closeConfirm}
    on:confirm={remove}
  />
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
