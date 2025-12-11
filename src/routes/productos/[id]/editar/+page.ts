import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
import { categoriasService, repuestosService } from '$lib/utils/pocketbase';

export const prerender = false;

export const load: PageLoad = async ({ params, fetch }) => {
  const { id } = params;
  const producto = await repuestosService.getById(id, fetch);
  const categorias = await categoriasService.getAll(fetch);

  if (!producto) {
    throw error(404, 'Producto no encontrado');
  }

  return { producto, categorias };
};
