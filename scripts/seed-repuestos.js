// Script para poblar PocketBase con ~2000 repuestos y categorías.
// Uso: PB_URL=http://127.0.0.1:8090 PB_USER=admin@example.com PB_PASS=admin123 node scripts/seed-repuestos.js
// Requiere que la colección "categorias" tenga campo "nombre" y "repuestos" tenga
// nombre, codigo_producto, marca, descripcion, precio (number), stock (number), disponible (bool), categoria (relación) e imagen_url (text/url).

import PocketBase from 'pocketbase';

const PB_URL = process.env.PB_URL || 'http://127.0.0.1:8090';
const PB_USER = process.env.PB_USER || 'admin@example.com';
const PB_PASS = process.env.PB_PASS || 'admin123';
const TOTAL_ITEMS = 2000;
const BATCH_SIZE = 100;

const categories = [
  'Motor',
  'Transmisión',
  'Frenos',
  'Suspensión',
  'Eléctrico',
  'Filtros',
  'Llantas',
  'Carrocería',
  'Accesorios',
  'Lubricantes'
];

const brands = ['Yamaha', 'Honda', 'Suzuki', 'KTM', 'Kawasaki', 'BMW', 'Ducati', 'Aprilia', 'Bajaj', 'TVS'];
const images = [
  'https://images.unsplash.com/photo-1502877828070-33b167ad6860?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1518552901867-85dc8e84d825?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1504215680853-026ed2a45def?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1523966211575-eb4a01e7dd51?auto=format&fit=crop&w=900&q=80'
];

const descriptions = [
  'Repuesto original con especificación OEM.',
  'Compatible con modelos de calle y enduro.',
  'Construcción reforzada para mayor durabilidad.',
  'Probado en banco para asegurar tolerancias exactas.',
  'Incluye garantía limitada del fabricante.',
  'Listo para instalar, no requiere modificaciones.'
];

const randomOf = (arr) => arr[Math.floor(Math.random() * arr.length)];

async function upsertCategories(pb) {
  const existing = await pb.collection('categorias').getFullList({ perPage: 200 });
  const map = new Map(existing.map((c) => [c.nombre, c.id]));
  const ids = {};

  for (const name of categories) {
    if (map.has(name)) {
      ids[name] = map.get(name);
      continue;
    }
    const created = await pb.collection('categorias').create({ nombre: name });
    ids[name] = created.id;
  }

  return ids;
}

function buildItem(idx, categoryId) {
  const marca = randomOf(brands);
  const precio = Math.floor(40000 + Math.random() * 460000);
  const stock = Math.floor(Math.random() * 30) + 1;
  return {
    nombre: `Repuesto ${idx + 1} ${marca}`,
    codigo_producto: `MOTO-${String(idx + 1).padStart(5, '0')}`,
    marca,
    descripcion: randomOf(descriptions),
    precio,
    stock,
    disponible: stock > 0,
    categoria: categoryId,
    imagen_url: randomOf(images)
  };
}

async function seed() {
  const pb = new PocketBase(PB_URL);
  // Disable SDK auto-cancellation so parallel creates don't abort each other.
  pb.autoCancellation(false);
  await pb.admins.authWithPassword(PB_USER, PB_PASS);
  console.log('✓ Autenticado en PocketBase', PB_URL);

  const categoryIds = await upsertCategories(pb);
  const categoryList = Object.values(categoryIds);

  const payload = Array.from({ length: TOTAL_ITEMS }, (_, i) => {
    const catId = categoryList[i % categoryList.length];
    return buildItem(i, catId);
  });

  for (let i = 0; i < payload.length; i += BATCH_SIZE) {
    const batch = payload.slice(i, i + BATCH_SIZE);
    const tasks = batch.map((item) => pb.collection('repuestos').create(item));
    await Promise.all(tasks);
    console.log(`✓ Insertados ${Math.min(i + BATCH_SIZE, payload.length)} / ${payload.length}`);
  }

  console.log('✅ Seed completado');
}

seed().catch((err) => {
  console.error('❌ Error al sembrar datos', err);
  process.exit(1);
});
