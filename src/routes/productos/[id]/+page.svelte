<script lang="ts">
  import type { PageData } from './$types';
  import { cartStore } from '$lib/stores/cart';

  export let data: PageData;
  const producto = data.producto;

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(value ?? 0);

  const placeholderImage = '/placeholder-product.svg';
  let imageSrc = producto.imagen_url || placeholderImage;

  const categoriaLabel = () => {
    const expanded: any = (producto as any).expand?.categoria;
    if (expanded && typeof expanded === 'object') {
      return expanded.nombre ?? expanded.name ?? producto.categoria;
    }
    return producto.categoria || 'Sin categoría';
  };

  const handleError = (event: Event) => {
    const img = event.currentTarget as HTMLImageElement;
    img.src = placeholderImage;
    imageSrc = placeholderImage;
  };

  const add = () => cartStore.addItem(producto);
</script>

<svelte:head>
  <title>{producto.nombre} | Detalle</title>
</svelte:head>

<section class="page">
  <div class="header">
    <div>
      <p class="pill">Detalle del repuesto</p>
      <h1>{producto.nombre}</h1>
      <p class="muted">Código: {producto.codigo_producto}</p>
      <div class="tags">
        <span class={producto.disponible ? 'badge ok' : 'badge off'}>{producto.disponible ? 'Disponible' : 'Agotado'}</span>
        <span class="badge">Stock: {producto.stock}</span>
        <span class="badge">Categoría: {categoriaLabel()}</span>
      </div>
    </div>
    <div class="actions">
      <a class="secondary" href="/productos">Volver</a>
      <a class="secondary" href={`/productos/${producto.id}/editar`}>Editar</a>
      <button class="primary" type="button" on:click={add} disabled={!producto.disponible}>Añadir al carrito</button>
    </div>
  </div>

  <div class="content">
    <div class="image">
      {#if imageSrc}
        <img src={imageSrc} alt={`Imagen de ${producto.nombre}`} loading="lazy" on:error={handleError} />
      {:else}
        <div class="placeholder">Imagen no disponible</div>
      {/if}
    </div>
    <div class="details">
      <p class="price">{formatCurrency(producto.precio)}</p>
      {#if producto.marca}<p class="muted">Marca: {producto.marca}</p>{/if}
      <p>{producto.descripcion || 'Sin descripción disponible.'}</p>
      <div class="meta">
        <div>
          <p class="meta-label">Código</p>
          <p>{producto.codigo_producto}</p>
        </div>
        <div>
          <p class="meta-label">Actualizado</p>
          <p>{new Date(producto.updated).toLocaleString()}</p>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .page {
    padding: 2rem 1rem 3rem;
    max-width: 1100px;
    margin: 0 auto;
    color: var(--ink-2);
  }

  .header {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
    align-items: flex-start;
  }

  h1 {
    margin: 0.2rem 0;
    color: var(--ink);
  }

  .muted {
    color: #94a3b8;
    margin: 0;
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    margin-top: 0.5rem;
  }

  .content {
    margin-top: 1.5rem;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1rem;
  }

  .image {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid var(--border);
    border-radius: 16px;
    min-height: 260px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .placeholder {
    color: #64748b;
    font-size: 0.95rem;
  }

  .details {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 1rem 1.25rem;
    display: grid;
    gap: 0.5rem;
  }

  .price {
    font-size: 1.4rem;
    font-weight: 700;
    color: var(--ink);
    margin: 0;
  }

  .meta {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 0.8rem;
    margin-top: 0.5rem;
  }

  .meta-label {
    margin: 0;
    color: #94a3b8;
    font-size: 0.9rem;
  }

  .badge {
    padding: 0.3rem 0.65rem;
    border-radius: 999px;
    font-size: 0.85rem;
    border: 1px solid var(--border);
    background: rgba(255, 255, 255, 0.03);
  }

  .badge.ok {
    background: #ecfdf3;
    color: #15803d;
    border-color: #bbf7d0;
  }

  .badge.off {
    background: #fef2f2;
    color: #b91c1c;
    border-color: #fecdd3;
  }

  .actions {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    align-items: center;
  }

  .primary,
  .secondary {
    padding: 0.65rem 1rem;
    border-radius: 10px;
    border: 1px solid var(--border);
    cursor: pointer;
    text-decoration: none;
    font-weight: 600;
    color: var(--ink);
  }

  .secondary {
    background: rgba(255, 255, 255, 0.03);
  }

  .primary {
    background: linear-gradient(120deg, #2563eb, #1e3a8a);
    color: #f8fafc;
    border: none;
  }

  .primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 720px) {
    .actions {
      width: 100%;
      justify-content: flex-start;
    }
  }
</style>
