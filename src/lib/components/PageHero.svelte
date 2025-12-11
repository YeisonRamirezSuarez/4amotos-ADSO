<script lang="ts">
  export let eyebrow = '';
  export let title = '';
  export let subtitle = '';
  export let meta = '';
</script>

<section class="hero">
  <div>
    {#if eyebrow}<p class="eyebrow">{eyebrow}</p>{/if}
    {#if title}<h1>{title}</h1>{/if}
    {#if subtitle}<p class="lede">{subtitle}</p>{/if}
  </div>
  {#if meta}
    <div class="hero-meta">
      <p>{meta}</p>
    </div>
  {/if}
</section>

<style>
  .hero {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 16px;
    padding: 20px;
    background: linear-gradient(135deg, var(--panel), var(--panel-soft));
    border: 1px solid var(--border);
    border-radius: 16px;
    box-shadow: var(--shadow);
  }

  .eyebrow {
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-size: 12px;
    color: var(--accent-2);
    margin: 0 0 6px 0;
  }

  h1 {
    margin: 0;
    font-size: 28px;
    color: var(--ink);
  }

  .lede {
    margin: 6px 0 0;
    color: var(--ink-3);
    max-width: 900px;
  }

  .hero-meta {
    min-width: 180px;
    text-align: right;
    color: var(--ink-3);
  }
</style>
