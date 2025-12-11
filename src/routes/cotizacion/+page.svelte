<script lang="ts">
  import { cartStore } from '$lib/stores/cart';
  import PageHero from '$lib/components/PageHero.svelte';

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(value ?? 0);

  const today = new Date().toLocaleDateString('es-CO');

  const subtotal = (precio: number, cantidad: number) => precio * cantidad;

  const updateQty = (id: string, value: string) => {
    const parsed = Number(value) || 1;
    cartStore.updateQuantity(id, parsed);
  };

  const totalItems = () => $cartStore.reduce((acc, item) => acc + item.cantidad, 0);
  const totalPrice = () =>
    $cartStore.reduce((acc, item) => acc + item.cantidad * item.repuesto.precio, 0);
</script>

<svelte:head>
  <title>Cotización | 4amotos</title>
</svelte:head>

<div class="quote-page">
  <div class="hero-wrap no-print">
    <PageHero
      eyebrow="Cotización"
      title="Resumen de tu carrito"
      subtitle="Ajusta cantidades, guarda o imprime tu lista para compartirla."
      meta={`${totalItems()} ítems`}
    />

    <div class="hero-actions">
      <a class="ghost" href="/tienda">Volver a la tienda</a>
      <button type="button" class="secondary" on:click={() => cartStore.clear()} disabled={$cartStore.length === 0}>
        Vaciar
      </button>
      <button type="button" on:click={() => window.print()} disabled={$cartStore.length === 0}>Imprimir</button>
    </div>
  </div>

  {#if $cartStore.length === 0}
    <div class="empty">
      <p class="muted">Tu cotización está vacía. Agrega productos desde la tienda.</p>
      <a class="primary" href="/tienda">Ir a la tienda</a>
    </div>
  {:else}
    <div class="layout">
      <section class="list">
        {#each $cartStore as item}
          <article class="card">
            <div class="card__top">
              <div class="titles">
                <p class="muted sku">{item.repuesto.codigo_producto}</p>
                <h2>{item.repuesto.nombre}</h2>
                {#if item.repuesto.marca}
                  <p class="muted brand">{item.repuesto.marca}</p>
                {/if}
              </div>
              <div class="price-col">
                <p class="unit">{formatCurrency(item.repuesto.precio)}</p>
                <p class="muted">Unidad</p>
              </div>
            </div>

            <div class="card__actions">
              <div class="stock">Stock: {item.repuesto.stock}</div>
              <div class="qty-group">
                <label class="muted" for={`qty-${item.repuesto.id}`}>Cantidad</label>
                <input
                  id={`qty-${item.repuesto.id}`}
                  type="number"
                  min="1"
                  value={item.cantidad}
                  on:input={(e) => updateQty(item.repuesto.id, (e.target as HTMLInputElement).value)}
                />
              </div>
              <div class="spacer"></div>
              <p class="line-total">{formatCurrency(subtotal(item.repuesto.precio, item.cantidad))}</p>
              <button type="button" class="ghost" on:click={() => cartStore.removeItem(item.repuesto.id)}>
                Quitar
              </button>
            </div>
          </article>
        {/each}
      </section>

      <aside class="summary">
        <p class="pill" style="margin:0;">Total</p>
        <h3 style="margin:0.35rem 0 0;">{totalItems()} ítems</h3>
        <p class="total">{formatCurrency(totalPrice())}</p>
        <p class="muted">Los precios son de referencia e incluyen impuestos si aplican.</p>
        <div class="summary-actions">
          <a class="primary" href="/tienda">Seguir comprando</a>
          <button type="button" class="secondary" on:click={() => window.print()}>Imprimir</button>
        </div>
      </aside>
    </div>

    <div class="print-only">
      <header class="print-header">
        <div>
          <p class="eyebrow">Cotización</p>
          <h1>Listado de repuestos</h1>
        </div>
        <div class="print-meta">
          <p class="muted">Fecha: {today}</p>
          <p class="muted">Items: {totalItems()}</p>
        </div>
      </header>

      <table class="print-table">
        <thead>
          <tr>
            <th>Producto</th>
            <th>SKU</th>
            <th>Marca</th>
            <th>Cant.</th>
            <th>Precio Unit.</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {#each $cartStore as item}
            <tr>
              <td>{item.repuesto.nombre}</td>
              <td>{item.repuesto.codigo_producto}</td>
              <td>{item.repuesto.marca ?? '—'}</td>
              <td style="text-align:center;">{item.cantidad}</td>
              <td style="text-align:right;">{formatCurrency(item.repuesto.precio)}</td>
              <td style="text-align:right;">{formatCurrency(subtotal(item.repuesto.precio, item.cantidad))}</td>
            </tr>
          {/each}
        </tbody>
      </table>

      <div class="print-summary">
        <p class="muted">Total</p>
        <p class="total">{formatCurrency(totalPrice())}</p>
      </div>
    </div>
  {/if}
</div>

<style>
  .quote-page {
    max-width: 1200px;
    width: 100%;
    margin: 20px auto 120px;
    padding: 0 0 48px;
    color: var(--ink-2);
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .hero-wrap {
    display: grid;
    gap: 12px;
  }

  .muted {
    color: var(--ink-3);
    margin: 0;
  }

  .hero-actions {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 320px;
    gap: 1rem;
    align-items: start;
  }

  .list {
    display: grid;
    gap: 0.75rem;
  }

  .card {
    background: linear-gradient(145deg, var(--panel), var(--panel-soft));
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 1rem;
    box-shadow: var(--shadow);
    display: grid;
    gap: 0.65rem;
  }

  .card__top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
  }

  h2 {
    margin: 0.1rem 0 0.1rem;
    color: var(--ink);
    font-size: 1.05rem;
  }

  .sku,
  .brand {
    margin: 0;
  }

  .price-col {
    text-align: right;
    min-width: 140px;
  }

  .unit {
    margin: 0;
    font-weight: 700;
    color: var(--ink);
  }

  .card__actions {
    display: grid;
    grid-template-columns: auto auto 1fr auto auto;
    align-items: center;
    gap: 0.65rem;
  }

  .stock {
    color: var(--ink-3);
  }

  .qty-group input {
    width: 90px;
    border-radius: 10px;
    border: 1px solid var(--border);
    background: var(--panel-soft);
    color: var(--ink);
    padding: 0.4rem 0.6rem;
  }

  .spacer {
    flex: 1;
  }

  .line-total {
    margin: 0;
    font-weight: 700;
    color: var(--ink);
  }

  .summary {
    position: sticky;
    top: 1rem;
    background: linear-gradient(145deg, var(--panel), var(--panel-soft));
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 1rem;
    box-shadow: var(--shadow);
    display: grid;
    gap: 0.4rem;
  }

  .total {
    margin: 0;
    font-size: 1.4rem;
    font-weight: 800;
    color: var(--ink);
  }

  .summary-actions {
    display: grid;
    gap: 0.5rem;
    margin-top: 0.4rem;
  }

  .empty {
    background: linear-gradient(145deg, var(--panel), var(--panel-soft));
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 1.4rem;
    text-align: center;
    box-shadow: var(--shadow);
    display: grid;
    gap: 0.5rem;
  }

  button,
  .primary,
  .ghost,
  .secondary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.35rem;
    padding: 0.65rem 0.9rem;
    border-radius: 10px;
    font-weight: 700;
    cursor: pointer;
    text-decoration: none;
    transition: transform 120ms ease, border-color 120ms ease, filter 120ms ease;
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  button {
    width: auto;
    border: 1px solid var(--border);
    background: linear-gradient(120deg, var(--accent), var(--accent-2));
    color: #0b1222;
  }

  button:hover:not(:disabled) {
    transform: translateY(-1px);
  }

  .secondary {
    background: var(--panel);
    border: 1px solid var(--border);
    color: var(--ink);
  }

  .ghost {
    background: transparent;
    border: 1px dashed var(--border);
    color: var(--ink-2);
  }

  .primary {
    background: linear-gradient(120deg, var(--accent), var(--accent-2));
    border: none;
    color: #0b1222;
    text-align: center;
  }

  .primary:hover,
  button:hover:not(:disabled) {
    filter: brightness(1.04);
  }

  .print-only {
    display: none;
    background: #fff;
    color: #000;
    padding: 0.5rem 0;
  }

  .print-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 0.5rem;
  }

  .print-meta {
    text-align: right;
  }

  .print-table {
    width: 100%;
    border-collapse: collapse;
    margin: 0.25rem 0 0.75rem;
    font-size: 0.95rem;
  }

  .print-table th,
  .print-table td {
    border: 1px solid #d0d7e2;
    padding: 0.4rem 0.5rem;
  }

  .print-table th {
    background: #f2f5f9;
    text-align: left;
  }

  .print-summary {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 1rem;
    font-weight: 800;
    color: #000;
  }

  @media (max-width: 900px) {
    .layout {
      grid-template-columns: 1fr;
    }

    .summary {
      position: relative;
      top: auto;
    }

    .card__top {
      flex-direction: column;
      align-items: flex-start;
    }

    .card__actions {
      grid-template-columns: 1fr 1fr;
      grid-template-areas:
        'stock stock'
        'qty qty'
        'total total'
        'remove remove';
    }

    .stock {
      grid-area: stock;
    }

    .qty-group {
      grid-area: qty;
    }

    .line-total {
      grid-area: total;
    }

    .ghost {
      grid-area: remove;
    }
  }

  @media print {
    :global(body) {
      background: #fff;
      color: #000;
    }

    :global(.app > header),
    :global(.app > footer),
    :global(.nav),
    :global(.footer),
    :global(.shell.nav),
    :global(.shell.footer) {
      display: none !important;
    }

    .quote-page {
      max-width: none;
      padding: 0;
      color: #000;
    }

    .layout,
    .summary,
    .list,
    .empty,
    .hero-actions,
    .no-print,
    button,
    .primary,
    .secondary,
    .ghost {
      display: none !important;
    }

    .print-only {
      display: block;
      padding: 0;
      margin: 0;
    }

    .print-table th,
    .print-table td,
    .print-summary {
      color: #000;
    }

    @page {
      margin: 12mm;
    }
  }
</style>
