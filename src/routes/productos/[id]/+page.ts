import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
import { repuestosService } from '$lib/utils/pocketbase';

export const prerender = false;

export const load: PageLoad = async ({ params, fetch }) => {
  const producto = await repuestosService.getById(params.id, fetch);

  if (!producto) {
    throw error(404, 'Producto no encontrado');
  }

  return { producto };
};
