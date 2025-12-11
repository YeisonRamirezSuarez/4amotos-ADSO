import type { PageLoad } from './$types';
import { categoriasService, repuestosService } from '$lib/utils/pocketbase';

export const prerender = false;

export const load: PageLoad = async ({ fetch }) => {
  try {
    const page = 1;
    const perPage = 24;
    const [result, categorias] = await Promise.all([
      repuestosService.getAll(page, perPage, fetch),
      categoriasService.getAll(fetch).catch(() => [])
    ]);
    return {
      items: result.items,
      totalItems: result.totalItems,
      page: result.page,
      perPage: result.perPage,
      categorias
    };
  } catch (error) {
    console.error('Error loading products', error);
    return {
      items: [],
      totalItems: 0,
      categorias: [],
      error: 'No se pudieron cargar los productos.'
    };
  }
};
