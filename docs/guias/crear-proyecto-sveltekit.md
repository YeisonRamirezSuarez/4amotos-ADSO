# Guía Paso a Paso: Crear Proyecto SvelteKit con TypeScript

Esta guía te llevará paso a paso por el proceso de crear el proyecto 4AMotos usando SvelteKit con TypeScript, basada en la documentación oficial más reciente.

> 🚀 Importante: Este proyecto utilizará TypeScript para mejorar la calidad del código, detección temprana de errores y mejor experiencia de desarrollo.

## Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:
- ✅ Node.js (v18.x LTS o superior)
- ✅ npm (v9.x o superior)
- ✅ Git configurado

> 💡 Si no tienes estos instalados, revisa las guías anteriores en la carpeta `guias/`.

## Paso 1: Crear el Proyecto SvelteKit

### Opción A: Comando Básico con TypeScript (Recomendado)
```bash
# Crear proyecto con el nombre específico y TypeScript
npx sv create 4amotos-system --template=default --types=typescript

# Navegar al directorio del proyecto
cd 4amotos-system
```

### Opción B: Con Selección Interactiva
```bash
# Crear proyecto con selección de opciones
npx sv create

# Seguir las opciones del wizard:
# - Project name: 4amotos-system
# - Template: SvelteKit demo app (recommended)
# - TypeScript: Yes (OBLIGATORIO para este proyecto)
# - ESLint: Yes (recomendado)
# - Prettier: Yes (recomendado)
# - Playwright: No (por ahora, se puede agregar después)
# - Vitest: Yes (para testing con soporte TypeScript)
```

## Paso 2: Configuración Inicial del Proyecto

### Instalar Dependencias
```bash
# Instalar todas las dependencias del proyecto
npm install

# Verificar que todo esté instalado correctamente
npm list --depth=0
```

### Instalar PocketBase SDK con Tipos
```bash
# Instalar el SDK de PocketBase para la conexión con la base de datos
npm install pocketbase

# Instalar tipos adicionales para TypeScript (si es necesario)
npm install -D @types/node

# Verificar la instalación
npm list pocketbase
```

## Paso 3: Estructura del Proyecto Creado

Después de la creación, tu proyecto tendrá esta estructura:

```
4amotos-system/
├── src/
│   ├── lib/
│   │   ├── server/          # Código del servidor (server-only)
│   │   └── index.ts         # Utilidades compartidas (TypeScript)
│   ├── params/              # Validadores de parámetros de ruta
│   ├── routes/              # Páginas y endpoints
│   │   ├── +layout.svelte   # Layout principal
│   │   └── +page.svelte     # Página de inicio
│   ├── app.html             # Template HTML principal
│   ├── app.d.ts             # Definiciones de tipos globales
│   ├── error.html           # Página de error personalizada
│   ├── hooks.client.ts      # Hooks del lado del cliente (TypeScript)
│   ├── hooks.server.ts      # Hooks del lado del servidor (TypeScript)
│   └── service-worker.js    # Service worker (PWA)
├── static/                  # Archivos estáticos
├── tests/                   # Tests automatizados
├── package.json             # Configuración del proyecto
├── svelte.config.js         # Configuración de SvelteKit
├── tsconfig.json            # Configuración TypeScript
├── vite.config.ts           # Configuración de Vite (TypeScript)
└── .svelte-kit/             # Archivos generados por SvelteKit
    └── tsconfig.json        # Configuración TypeScript generada
```

## Paso 4: Verificar la Instalación

### Ejecutar el Servidor de Desarrollo
```bash
# Iniciar el servidor de desarrollo
npm run dev

# O iniciar y abrir automáticamente en el navegador
npm run dev -- --open
```

**Resultado esperado:**
- El servidor debería ejecutarse en `http://localhost:5173`
- Deberías ver la página de bienvenida de SvelteKit
- Los archivos se deberían recargar automáticamente al hacer cambios

### Verificar Scripts Disponibles
```bash
# Ver todos los scripts disponibles
npm run
```

**Scripts principales:**
- `npm run dev` - Servidor de desarrollo con hot reload
- `npm run build` - Construir para producción (con verificación de tipos)
- `npm run preview` - Vista previa de la versión construida
- `npm run check` - Verificar tipos de TypeScript
- `npm run check:watch` - Verificar tipos en modo watch
- `npm test` - Ejecutar tests con Vitest y TypeScript

## Paso 5: Configuración Específica para 4AMotos

### Actualizar package.json
```json
{
  "name": "4amotos-system",
  "version": "0.0.1",
  "description": "Sistema web para consulta y cotización de repuestos 4AMotos",
  "private": true,
  "scripts": {
    "dev": "vite dev",
    "build": "vite build",
    "preview": "vite preview",
    "check": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json",
    "check:watch": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json --watch",
    "test": "vitest",
    "lint": "eslint .",
    "format": "prettier --write ."
  },
  "devDependencies": {
    "@sveltejs/adapter-auto": "^3.0.0",
    "@sveltejs/kit": "^2.0.0",
    "@types/node": "^20.0.0",
    "svelte": "^4.0.0",
    "svelte-check": "^3.0.0",
    "tslib": "^2.4.1",
    "typescript": "^5.0.0",
    "vite": "^5.0.0",
    "vitest": "^1.0.0"
  },
  "dependencies": {
    "pocketbase": "^0.21.0"
  },
  "type": "module"
}
```

### Configurar svelte.config.js
```javascript
import adapter from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// adapter-auto detecta automáticamente el entorno de despliegue
		adapter: adapter(),
		
		// Configuración específica para el proyecto
		alias: {
			'$lib': 'src/lib',
			'$components': 'src/lib/components',
			'$stores': 'src/lib/stores',
			'$utils': 'src/lib/utils'
		}
	}
};

export default config;
```

### Configurar vite.config.ts (TypeScript)
```typescript
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	
	// Configuración específica para desarrollo
	server: {
		port: 5173,
		open: true
	},
	
	// Configuración para el build de producción
	build: {
		target: 'es2020'
	},
	
	// Configuración para tests con Vitest
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
```

## Paso 6: Configurar Estructura para 4AMotos

### Crear Directorios Necesarios
```bash
# Crear estructura de carpetas específica para el proyecto
mkdir -p src/lib/components
mkdir -p src/lib/stores
mkdir -p src/lib/utils
mkdir -p src/routes/productos
mkdir -p src/routes/cotizacion
mkdir -p src/routes/api
mkdir -p pocketbase
```

### Crear Archivos Base
```bash
# Crear archivos iniciales con TypeScript
touch src/lib/stores/products.ts
touch src/lib/stores/cart.ts
touch src/lib/utils/pocketbase.ts
touch src/lib/types/index.ts
touch src/routes/productos/+page.svelte
touch src/routes/cotizacion/+page.svelte
```

## Paso 7: Configuración de Git

### Inicializar Repositorio
```bash
# Inicializar Git (si no se hizo antes)
git init

# Agregar archivos al staging
git add .

# Crear primer commit
git commit -m "feat: configuración inicial del proyecto SvelteKit

- Creado proyecto base con SvelteKit
- Configurado PocketBase SDK
- Establecida estructura de carpetas para 4AMotos
- Configurado TypeScript con verificación estricta
- Configurado ESLint y Prettier para TypeScript
- Establecidos tipos personalizados para el proyecto

```

### Configurar .gitignore
El proyecto ya viene con un `.gitignore` básico, pero agreguemos entradas específicas:

```gitignore
# Dependencias
node_modules/
npm-debug.log*

# SvelteKit
.svelte-kit/
build/

# Entorno
.env
.env.local
.env.production

# PocketBase
pocketbase/pb_data/
*.db

# IDEs
.vscode/
.idea/

# Sistema
.DS_Store
Thumbs.db
```

## Paso 8: Configuración TypeScript Específica

### Verificar Configuración TypeScript
```bash
# Verificar que TypeScript está correctamente configurado
npm run check

# Verificar tipos en modo watch (útil durante desarrollo)
npm run check:watch
```

### Configurar tipos personalizados para 4AMotos (EJEMPLO)
Crea el archivo `src/lib/types/index.ts`:

```typescript
// Tipos para el sistema 4AMotos

export interface Repuesto {
  id: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  categoria: string;
  stock: number;
  disponible: boolean;
  imagen_url?: string;
  marca?: string;
  codigo_producto: string;
  created: string;
  updated: string;
}

export interface Categoria {
  id: string;
  nombre: string;
  descripcion?: string;
  created: string;
}

export interface CartItem {
  repuesto: Repuesto;
  cantidad: number;
}

export interface SearchFilters {
  nombre?: string;
  categoria?: string;
  precio_min?: number;
  precio_max?: number;
  disponible?: boolean;
}
```

### Configurar PocketBase con TypeScript
Actualiza `src/lib/utils/pocketbase.ts`:

```typescript
import PocketBase from 'pocketbase';
import type { Repuesto, Categoria } from '$lib/types';

// Configurar cliente PocketBase
export const pb = new PocketBase('http://127.0.0.1:8090');

// Funciones tipadas para PocketBase
export const repuestosService = {
  async getAll(page = 1, perPage = 20): Promise<{ items: Repuesto[]; totalItems: number }> {
    return await pb.collection('repuestos').getList(page, perPage);
  },

  async search(filters: SearchFilters): Promise<Repuesto[]> {
    let filter = '';
    const conditions: string[] = [];

    if (filters.nombre) {
      conditions.push(`nombre ~ "${filters.nombre}"`);
    }
    if (filters.categoria) {
      conditions.push(`categoria = "${filters.categoria}"`);
    }
    if (filters.disponible !== undefined) {
      conditions.push(`disponible = ${filters.disponible}`);
    }
    if (filters.precio_min) {
      conditions.push(`precio >= ${filters.precio_min}`);
    }
    if (filters.precio_max) {
      conditions.push(`precio <= ${filters.precimoax}`);
    }

    if (conditions.length > 0) {
      filter = conditions.join(' && ');
    }

    const result = await pb.collection('repuestos').getFullList({ filter });
    return result as Repuesto[];
  }
};

export const categoriasService = {
  async getAll(): Promise<Categoria[]> {
    const result = await pb.collection('categorias').getFullList();
    return result as Categoria[];
  }
};
```

## Paso 9: Agregar Integraciones Adicionales (Opcional)

### Tailwind CSS (Recomendado para estilos)
```bash
# Agregar Tailwind CSS usando sv
npx sv add tailwindcss

# O manualmente
npm install -D tailwindcss postcss autoprefixer @tailwindcss/typography
npx tailwindcss init -p
```

### Otras integraciones útiles
```bash
# Ver integraciones disponibles
npx sv add

# Opciones recomendadas para 4AMotos:
# - tailwindcss (estilos)
# - drizzle (si necesitas ORM adicional)
# - lucia (autenticación avanzada)
```

## Paso 9: Verificación Final

### Checklist de Verificación
- [ ] ✅ Proyecto SvelteKit creado exitosamente con TypeScript
- [ ] ✅ Dependencias instaladas (`npm install`)
- [ ] ✅ PocketBase SDK instalado con tipos
- [ ] ✅ Servidor de desarrollo funciona (`npm run dev`)
- [ ] ✅ Verificación de tipos funciona (`npm run check`)
- [ ] ✅ Estructura de carpetas específica creada
- [ ] ✅ Tipos personalizados definidos
- [ ] ✅ Git inicializado y primer commit realizado
- [ ] ✅ Configuración personalizada aplicada

### Comandos de Verificación
```bash
# Verificar versión de SvelteKit
npm list @sveltejs/kit

# Verificar que el servidor inicia correctamente
npm run dev

# Verificar tipos de TypeScript
npm run check

# Verificar que el build funciona
npm run build

# Verificar linting (si está configurado)
npm run lint
```

## Próximos Pasos

Con el proyecto SvelteKit configurado, ahora puedes continuar con:

### Semana 1 (Restante):
1. ✅ Crear proyecto SvelteKit (Completado)
2. 📋 Configurar y poblar PocketBase
3. 📋 Crear documentación inicial del proyecto

### Semana 2:
1. 📋 Diseñar esquema de base de datos
2. 📋 Configurar colecciones en PocketBase
3. 📋 Crear datos de prueba

## Recursos Útiles

### Comandos Frecuentes
```bash
# Desarrollo
npm run dev              # Servidor de desarrollo
npm run build            # Build de producción
npm run preview          # Vista previa del build

# TypeScript
npm run check            # Verificar tipos TypeScript
npm run check:watch      # Verificar tipos en modo watch

# Mantenimiento
npm run lint             # Verificar código
npm run format           # Formatear código
npm test                 # Ejecutar tests
npm outdated             # Verificar dependencias desactualizadas
npm update               # Actualizar dependencias
```

### Documentación
- SvelteKit: https://kit.svelte.dev/
- Svelte: https://svelte.dev/
- TypeScript: https://www.typescriptlang.org/
- SvelteKit TypeScript: https://kit.svelte.dev/docs/typescript
- PocketBase: https://pocketbase.io/docs/
- PocketBase JavaScript SDK: https://github.com/pocketbase/js-sdk
- Vite: https://vitejs.dev/

### Estructura de Archivos del Proyecto
```
4amotos-system/
├── src/lib/
│   ├── components/          # Componentes reutilizables (.svelte)
│   ├── stores/             # Estado global (Svelte stores .ts)
│   ├── types/              # Definiciones de tipos TypeScript
│   ├── utils/              # Utilidades y helpers (.ts)
│   └── server/             # Código del servidor únicamente (.ts)
├── src/routes/
│   ├── productos/          # Páginas de productos
│   ├── cotizacion/         # Páginas de cotización
│   └── api/                # Endpoints de API
├── static/                 # Archivos estáticos
└── pocketbase/             # Base de datos PocketBase
```

---

🎉 ¡Felicitaciones! Tienes tu proyecto SvelteKit con TypeScript configurado y listo para el desarrollo del sistema 4AMotos.

💡 Consejos importantes:
- Mantén el servidor de desarrollo corriendo mientras trabajas (`npm run dev`)
- Usa `npm run check:watch` en otra terminal para verificación continua de tipos
- TypeScript te ayudará a detectar errores antes de que lleguen a producción
- Define tipos personalizados en `src/lib/types/` para mejor autocompletado
- El compilador de Svelte ya incluye soporte completo para TypeScript
