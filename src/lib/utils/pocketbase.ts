import PocketBase from 'pocketbase';
import { env as publicEnv } from '$env/dynamic/public';
import type { Repuesto, Categoria, SearchFilters } from '$lib/types';

// Allow overriding the PocketBase endpoint via env; fall back to local dev.
export const pocketbaseBaseUrl = publicEnv.PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';
export const pb = new PocketBase(pocketbaseBaseUrl);

// Allow SSR load functions to inject the provided fetch to avoid warnings.
const clientWithFetch = (customFetch?: typeof fetch) =>
  customFetch ? new PocketBase(pocketbaseBaseUrl, { fetch: customFetch }) : pb;

export const isPocketbaseAlive = async (customFetch?: typeof fetch, timeoutMs = 5000): Promise<boolean> => {
  const fetcher = customFetch ?? fetch;
  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timer = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;

  try {
    const res = await fetcher(`${pocketbaseBaseUrl}/api/health`, {
      method: 'GET',
      signal: controller?.signal,
      cache: 'no-store'
    });
    if (!res.ok) return false;
    const data = (await res.json().catch(() => ({}))) as { code?: number; message?: string };
    return data?.code === 200 || data?.message === 'OK';
  } catch (err) {
    console.warn('PocketBase health check failed', err);
    return false;
  } finally {
    if (timer) clearTimeout(timer);
  }
};

type ListResult<T> = { items: T[]; totalItems: number; page: number; perPage: number };

export const repuestosService = {
  async getAll(page = 1, perPage = 20, customFetch?: typeof fetch): Promise<ListResult<Repuesto>> {
    const client = clientWithFetch(customFetch);
    const res = (await client
      .collection('repuestos')
      .getList(page, perPage, { expand: 'categoria' })) as unknown as ListResult<Repuesto>;
    return res;
  },

  async create(data: Partial<Repuesto>) {
    const record = await pb.collection('repuestos').create(data);
    return record as Repuesto;
  },

  async search(
    filters: SearchFilters,
    page = 1,
    perPage = 20,
    customFetch?: typeof fetch
  ): Promise<ListResult<Repuesto>> {
    let filter = '';
    const conditions: string[] = [];

    if (filters.nombre) conditions.push(`nombre ~ \"${filters.nombre}\"`);
    if (filters.categoria) conditions.push(`categoria = \"${filters.categoria}\"`);
    if (filters.disponible !== undefined) conditions.push(`disponible = ${filters.disponible}`);
    if (filters.precio_min) conditions.push(`precio >= ${filters.precio_min}`);
    if (filters.precio_max) conditions.push(`precio <= ${filters.precio_max}`);

    if (conditions.length > 0) filter = conditions.join(' && ');

    const client = clientWithFetch(customFetch);
    const result = (await client
      .collection('repuestos')
      .getList(page, perPage, { filter, expand: 'categoria' })) as unknown as ListResult<Repuesto>;
    return result;
  },

  async getById(id: string, customFetch?: typeof fetch): Promise<Repuesto | null> {
    const client = clientWithFetch(customFetch);
    try {
      const result = (await client.collection('repuestos').getOne(id, { expand: 'categoria' })) as unknown as Repuesto;
      return result;
    } catch (err) {
      console.error('getById error', err);
      return null;
    }
  },

  async update(id: string, data: Partial<Repuesto>, customFetch?: typeof fetch): Promise<Repuesto> {
    const client = clientWithFetch(customFetch);
    const record = await client.collection('repuestos').update(id, data);
    return record as Repuesto;
  },

  async remove(id: string, customFetch?: typeof fetch): Promise<void> {
    const client = clientWithFetch(customFetch);
    await client.collection('repuestos').delete(id);
  }
};

export const categoriasService = {
  async getAll(customFetch?: typeof fetch): Promise<Categoria[]> {
    const client = clientWithFetch(customFetch);
    const result = (await client.collection('categorias').getFullList().catch(() => [])) as Categoria[];
    return Array.isArray(result) ? result : [];
  }
};
