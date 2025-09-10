# Guía de Instalación: Node.js y npm

Esta guía te ayudará a instalar Node.js y npm, herramientas esenciales para el desarrollo del proyecto 4AMotos.

## ¿Qué es Node.js y npm?

- Node.js: Entorno de ejecución de JavaScript del lado del servidor
- npm: Gestor de paquetes de Node.js (Node Package Manager)

## Métodos de Instalación

### Opción 1: Descarga Oficial (Recomendado)

#### Windows
1. Visita https://nodejs.org/
2. Descarga la versión LTS (Long Term Support)
3. Ejecuta el instalador .msi
4. Sigue el asistente de instalación (acepta todos los valores por defecto)
5. Reinicia tu computadora

#### macOS
1. Visita https://nodejs.org/
2. Descarga la versión LTS
3. Ejecuta el instalador .pkg
4. Sigue el asistente de instalación
5. Reinicia la terminal

#### Linux (Ubuntu/Debian)
```bash
# Actualizar el sistema
sudo apt update

# Instalar Node.js y npm
sudo apt install nodejs npm

# O usando NodeSource para la versión más reciente
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Opción 2: Usando NVM (Node Version Manager)

NVM permite manejar múltiples versiones de Node.js.

#### Windows (nvm-windows)
1. Descarga nvm-windows desde https://github.com/coreybutler/nvm-windows/releases
2. Instala el archivo .exe
3. Abre una nueva terminal como administrador
4. Ejecuta:
```bash
nvm install --lts
nvm use --lts
```

#### macOS/Linux
```bash
# Instalar NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Reiniciar la terminal o ejecutar:
source ~/.bashrc

# Instalar la versión LTS de Node.js
nvm install --lts
nvm use --lts
nvm alias default node
```

## Verificación de la Instalación

Abre una terminal/símbolo del sistema y ejecuta:

```bash
# Verificar versión de Node.js
node --version
# Debería mostrar algo como: v18.17.0

# Verificar versión de npm
npm --version
# Debería mostrar algo como: 9.6.7
```

## Configuración Inicial de npm

### 1. Configurar información de usuario (opcional)
```bash
npm config set init-author-name "Tu Nombre"
npm config set init-author-email "tu.email@ejemplo.com"
```

### 2. Configurar registro por defecto
```bash
npm config set registry https://registry.npmjs.org/
```

### 3. Verificar configuración
```bash
npm config list
```

## Actualización de npm

Para actualizar npm a la versión más reciente:

```bash
npm install -g npm@latest
```

## Resolución de Problemas Comunes

### Error de Permisos en macOS/Linux
Si encuentras errores de permisos al instalar paquetes globalmente:

```bash
# Cambiar el directorio por defecto de npm
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'

# Agregar a tu archivo .profile o .bashrc
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.profile
source ~/.profile
```

### Error "command not found" en Windows
1. Verifica que Node.js esté en las Variables de Entorno
2. Ve a Sistema → Configuración avanzada → Variables de entorno
3. Busca PATH en variables del sistema
4. Debe incluir: C:\Program Files\nodejs\

### Verificar PATH
```bash
# Windows
echo %PATH%

# macOS/Linux
echo $PATH
```

## Preparación para el Proyecto 4AMotos

Una vez instalado Node.js y npm, estarás listo para:

1. Crear el proyecto SvelteKit:
   ```bash
   npm create svelte@latest 4amotos-system
   ```

2. Instalar dependencias del proyecto:
   ```bash
   cd 4amotos-system
   npm install
   ```

3. Instalar PocketBase SDK:
   ```bash
   npm install pocketbase
   ```

## Comandos Útiles de npm

```bash
# Instalar un paquete localmente
npm install nombre-paquete

# Instalar un paquete globalmente
npm install -g nombre-paquete

# Instalar dependencias de desarrollo
npm install --save-dev nombre-paquete

# Ver paquetes instalados
npm list

# Ver paquetes desactualizados
npm outdated

# Actualizar paquetes
npm update

# Desinstalar un paquete
npm uninstall nombre-paquete
```

## Versiones Recomendadas para 4AMotos

- Node.js: v18.x LTS o superior
- npm: v9.x o superior

## Próximos Pasos

Con Node.js y npm instalados, puedes continuar con:
1. ✅ Instalación de Node.js y npm (Completado)
2. 📝 Descarga e instalación de PocketBase
3. 🚀 Creación del proyecto SvelteKit
4. 📁 Configuración de la estructura del proyecto

---

💡 Consejo: Mantén siempre Node.js y npm actualizados para aprovechar las últimas características y mejoras de seguridad.

📚 Recursos adicionales:
- Documentación oficial de Node.js: https://nodejs.org/docs/
- Documentación oficial de npm: https://docs.npmjs.com/
- Guía de npm para principiantes: https://nodesource.com/blog/an-absolute-beginners-guide-to-using-npm/
