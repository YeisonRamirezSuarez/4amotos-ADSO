<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let open = false;
  export let name = '';
  export let title = 'Eliminar repuesto';
  export let loading = false;

  const cancel = () => dispatch('cancel');
  const confirm = () => dispatch('confirm');
</script>

{#if open}
  <div class="modal-backdrop" role="dialog" aria-modal="true">
    <div class="modal">
      <div>
        <p class="pill" style="margin:0;">Confirmar</p>
        <h2 style="margin:0.4rem 0 0.2rem 0;">{title}</h2>
        <p class="muted" style="margin:0;">¿Seguro que deseas eliminar <strong>{name}</strong>? Esta acción no se puede deshacer.</p>
      </div>
      <div class="modal-actions">
        <button type="button" class="ghost" on:click={cancel} aria-label="Cancelar">Cancelar</button>
        <button type="button" class="danger-btn" on:click={confirm} disabled={loading} aria-label="Confirmar eliminación">{loading ? 'Eliminando...' : 'Eliminar'}</button>
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: grid;
    place-items: center;
    z-index: 20;
  }

  .modal {
    width: min(520px, calc(100% - 32px));
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 1.2rem;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
    display: grid;
    gap: 1rem;
  }

  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .ghost {
    background: transparent;
    color: var(--ink-2);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 10px 14px;
    font-weight: 600;
    cursor: pointer;
  }

  .danger-btn {
    background: #b91c1c;
    color: #fff;
    border: none;
    border-radius: 10px;
    padding: 10px 14px;
    font-weight: 700;
    cursor: pointer;
  }

  .ghost:disabled,
  .danger-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
</style>
