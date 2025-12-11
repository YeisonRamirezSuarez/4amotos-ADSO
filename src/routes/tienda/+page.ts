import type { PageLoad } from './$types';
import { categoriasService, repuestosService } from '$lib/utils/pocketbase';

export const prerender = false;

const PRICE_BUCKETS = [
  { id: 'low', label: 'Hasta $35.000', min: 0, max: 35000 },
  { id: 'mid', label: '$35.000 a $65.000', min: 35000, max: 65000 },
  { id: 'high', label: 'Más de $65.000', min: 65000, max: null }
] as const;

const sortMap: Record<string, string | undefined> = {
  relevancia: undefined,
  precio_asc: '+precio',
  precio_desc: '-precio',
  recientes: '-created',
  antiguos: '+created'
};

export const load: PageLoad = async ({ fetch, url }) => {
  const page = Number(url.searchParams.get('page')) || 1;
  const perPage = 10;
  const search = url.searchParams.get('search')?.trim() ?? '';
  const categoria = url.searchParams.get('categoria') ?? '';
  const categoriaNombre = url.searchParams.get('categoriaNombre')?.trim() ?? '';
  const marca = url.searchParams.get('marca') ?? '';
  const disponibles = url.searchParams.get('disponibles') === 'true';
  const precioMin = url.searchParams.get('precioMin') ?? '';
  const precioMax = url.searchParams.get('precioMax') ?? '';
  const orden = url.searchParams.get('orden') ?? 'relevancia';

  const categorias = await categoriasService.getAll(fetch).catch(() => []);

  const normalize = (value: string) =>
    value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();

  let categoriaResolved = categoria;
  let categoriaNombreFilter: string | undefined;

  if (!categoriaResolved && categoriaNombre) {
    const match = categorias.find((cat) => normalize(cat.nombre) === normalize(categoriaNombre));
    if (match) categoriaResolved = match.id;
  }

  // If we still don't have an ID, keep the name to filter by relation.
  if (!categoriaResolved && categoriaNombre) {
    categoriaNombreFilter = categoriaNombre;
  }

  const filters = {
    nombre: search || undefined,
    categoria: categoriaResolved || undefined,
    categoriaNombre: categoriaNombreFilter,
    disponible: disponibles ? true : undefined,
    precio_min: precioMin ? Number(precioMin) : undefined,
    precio_max: precioMax ? Number(precioMax) : undefined,
    marca: marca || undefined,
    sort: sortMap[orden]
  } as const;

  const [repuestosRaw, facetPool] = await Promise.all([
    repuestosService.search(filters, page, perPage, fetch).catch(() => ({
      items: [],
      totalItems: 0,
      page,
      perPage
    })),
    repuestosService
      .getAll(1, 200, fetch)
      .catch(() => ({ items: [], totalItems: 0, page: 1, perPage: 200 }))
  ]);

  const repuestos = {
    ...repuestosRaw,
    totalPages: Math.max(1, Math.ceil((repuestosRaw.totalItems ?? 0) / perPage))
  };

  const facetSource = Array.isArray(facetPool?.items) ? facetPool.items : [];

  const categoryFacets = categorias.map((cat) => ({
    id: cat.id,
    label: cat.nombre,
    count: facetSource.filter((item) => item.categoria === cat.id).length
  }));

  const brandCounts = facetSource.reduce((map, item) => {
    const key = (item.marca || '').trim();
    if (!key) return map;
    map.set(key, (map.get(key) ?? 0) + 1);
    return map;
  }, new Map<string, number>());

  const brandFacets = Array.from(brandCounts.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => a.label.localeCompare(b.label, 'es'));

  const priceFacets = PRICE_BUCKETS.map((bucket) => {
    const count = facetSource.filter((item) => {
      const precio = Number(item.precio) || 0;
      const minOk = bucket.min === null ? true : precio >= bucket.min;
      const maxOk = bucket.max === null ? true : precio < bucket.max;
      return minOk && maxOk;
    }).length;

    return { ...bucket, count };
  });

  return {
    repuestos,
    categorias,
    search,
    categoria: categoriaResolved,
    categoriaNombre: categoriaNombreFilter ?? categoriaNombre,
    marca,
    disponibles,
    precioMin,
    precioMax,
    page,
    perPage,
    orden,
    brandFacets,
    priceFacets,
    categoryFacets
  };
};
