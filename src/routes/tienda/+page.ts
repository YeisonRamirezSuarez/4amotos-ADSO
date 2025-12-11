import type { PageLoad } from './$types';
import { categoriasService, repuestosService } from '$lib/utils/pocketbase';

export const prerender = false;

export const load: PageLoad = async ({ fetch, url }) => {
  const page = Number(url.searchParams.get('page')) || 1;
  const perPage = 24;
  const search = url.searchParams.get('search')?.trim() ?? '';
  const categoria = url.searchParams.get('categoria') ?? '';
  const disponibles = url.searchParams.get('disponibles') === 'true';
  const precioMin = url.searchParams.get('precioMin') ?? '';
  const precioMax = url.searchParams.get('precioMax') ?? '';

  const filters = {
    nombre: search || undefined,
    categoria: categoria || undefined,
    disponible: disponibles ? true : undefined,
    precio_min: precioMin ? Number(precioMin) : undefined,
    precio_max: precioMax ? Number(precioMax) : undefined
  } as const;

  const [repuestosRaw, categorias] = await Promise.all([
    repuestosService.search(filters, page, perPage, fetch).catch(() => ({
      items: [],
      totalItems: 0,
      page,
      perPage
    })),
    categoriasService.getAll(fetch).catch(() => [])
  ]);

  const repuestos = {
    ...repuestosRaw,
    totalPages: Math.max(1, Math.ceil((repuestosRaw.totalItems ?? 0) / perPage))
  };

  return {
    repuestos,
    categorias,
    search,
    categoria,
    disponibles,
    precioMin,
    precioMax,
    page,
    perPage
  };
};
