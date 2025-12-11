import type { PageLoad } from './$types';
import { categoriasService } from '$lib/utils/pocketbase';

export const prerender = false;

export const load: PageLoad = async ({ fetch }) => {
  try {
    const categorias = await categoriasService.getAll(fetch);
    return { categorias };
  } catch (error) {
    console.error('Error loading categories', error);
    return { categorias: [] };
  }
};
