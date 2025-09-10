# Guía Básica: Git y GitHub

Esta guía te ayudará a configurar y usar Git y GitHub para el control de versiones del proyecto 4AMotos.

## ¿Qué es Git y GitHub?

- Git: Sistema de control de versiones distribuido que rastrea cambios en archivos
- GitHub: Plataforma web que aloja repositorios Git y facilita la colaboración

## Instalación de Git

### Windows
1. Descarga Git desde https://git-scm.com/
2. Ejecuta el instalador
3. Acepta todas las opciones por defecto
4. Se instalará Git Bash junto con Git

### macOS
```bash
# Usando Homebrew (recomendado)
brew install git

# O usando Xcode Command Line Tools
xcode-select --install
```

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install git
```

## Configuración Inicial

```bash
# Configurar nombre de usuario
git config --global user.name "Tu Nombre"

# Configurar email
git config --global user.email "tu.email@ejemplo.com"

# Verificar configuración
git config --list

# Configurar editor por defecto (opcional)
git config --global core.editor "code"  # Para VS Code
```

## Conceptos Fundamentales

### Estados de archivos en Git
- Working Directory: Archivos en tu carpeta de trabajo
- Staging Area: Archivos preparados para commit
- Repository: Archivos confirmados en el historial

### Flujo básico
```
Working Directory → (git add) → Staging Area → (git commit) → Repository
```

## 📋 Chuleta de Comandos Básicos

### Inicialización y Clonado
```bash
# Inicializar repositorio local
git init

# Clonar repositorio remoto
git clone https://github.com/usuario/repositorio.git

# Clonar a una carpeta específica
git clone https://github.com/usuario/repo.git mi-carpeta
```

### Estado y Información
```bash
# Ver estado de archivos
git status

# Ver historial de commits
git log

# Ver historial compacto
git log --oneline

# Ver diferencias no agregadas al staging
git diff

# Ver diferencias en staging
git diff --staged
```

### Agregando y Confirmando Cambios
```bash
# Agregar archivo específico al staging
git add archivo.txt

# Agregar todos los archivos modificados
git add .

# Agregar todos los archivos (incluyendo nuevos)
git add -A

# Confirmar cambios con mensaje
git commit -m "Descripción del cambio"

# Agregar y confirmar en un solo comando
git commit -am "Mensaje del commit"
```

### Trabajando con Ramas (Branches)
```bash
# Ver ramas existentes
git branch

# Crear nueva rama
git branch nombre-rama

# Cambiar a una rama
git checkout nombre-rama

# Crear y cambiar a nueva rama
git checkout -b nueva-rama

# Eliminar rama
git branch -d nombre-rama

# Fusionar rama actual con otra
git merge nombre-rama
```

### Repositorios Remotos
```bash
# Ver repositorios remotos
git remote -v

# Agregar repositorio remoto
git remote add origin https://github.com/usuario/repo.git

# Subir cambios al repositorio remoto
git push origin main

# Descargar cambios del repositorio remoto
git pull origin main

# Obtener información sin fusionar
git fetch origin
```

### Deshacer Cambios
```bash
# Deshacer cambios en working directory
git checkout -- archivo.txt

# Quitar archivo del staging area
git reset HEAD archivo.txt

# Deshacer último commit (mantiene cambios)
git reset --soft HEAD~1

# Deshacer último commit (elimina cambios)
git reset --hard HEAD~1

# Revertir commit específico
git revert <commit-hash>
```

## Configuración del Proyecto 4AMotos

### 1. Crear repositorio en GitHub
1. Ve a https://github.com y crea una cuenta
2. Clic en "New repository"
3. Nombre: `4amotos-system`
4. Descripción: "Sistema web para consulta y cotización de repuestos 4AMotos"
5. Selecciona "Public" o "Private"
6. Marca "Add a README file"
7. Clic en "Create repository"

### 2. Conectar repositorio local
```bash
# En tu carpeta del proyecto
cd 4amotos-system

# Inicializar Git
git init

# Agregar repositorio remoto
git remote add origin https://github.com/tu-usuario/4amotos-system.git

# Crear primer commit
git add .
git commit -m "Inicial commit: estructura básica del proyecto"

# Subir al repositorio remoto
git push -u origin main
```

## Flujo de Trabajo Recomendado para 4AMotos

### Desarrollo de características
```bash
# 1. Crear rama para nueva funcionalidad
git checkout -b feature/busqueda-productos

# 2. Desarrollar la funcionalidad
# ... hacer cambios en archivos ...

# 3. Agregar y confirmar cambios
git add .
git commit -m "Implementar búsqueda de productos por nombre"

# 4. Subir rama al repositorio remoto
git push origin feature/busqueda-productos

# 5. Cambiar a rama principal
git checkout main

# 6. Fusionar los cambios
git merge feature/busqueda-productos

# 7. Subir cambios fusionados
git push origin main

# 8. Eliminar rama de funcionalidad
git branch -d feature/busqueda-productos
```

## Buenas Prácticas

### Mensajes de Commit
```bash
# ✅ Buenos ejemplos
git commit -m "Agregar componente de búsqueda de productos"
git commit -m "Corregir error en cálculo de precios"
git commit -m "Actualizar documentación de API"

# ❌ Evitar
git commit -m "fix"
git commit -m "cambios"
git commit -m "asdf"
```

### Estructura de mensajes
```
tipo: descripción breve

- feat: nueva funcionalidad
- fix: corrección de bugs
- docs: documentación
- style: formato de código
- refactor: refactorización
- test: agregar tests
```

### Archivo .gitignore
Crea un archivo `.gitignore` para excluir archivos innecesarios:

```gitignore
# Dependencias de Node.js
node_modules/
npm-debug.log*

# Archivos de construcción
.svelte-kit/
build/
dist/

# Variables de entorno
.env
.env.local

# Archivos del sistema
.DS_Store
Thumbs.db

# IDEs
.vscode/
.idea/

# PocketBase
pocketbase/pb_data/
*.db
```

## 🚀 Comandos Avanzados Útiles

```bash
# Ver quien modificó cada línea de un archivo
git blame archivo.txt

# Buscar texto en todo el historial
git grep "texto-a-buscar"

# Crear tag para versiones
git tag v1.0.0
git push origin v1.0.0

# Guardar cambios temporalmente
git stash
git stash pop

# Ver cambios entre commits
git diff commit1..commit2

# Reescribir último commit
git commit --amend -m "Nuevo mensaje"
```

## Resolución de Conflictos

Cuando Git no puede fusionar automáticamente:

```bash
# 1. Git te mostrará los archivos con conflictos
git status

# 2. Edita los archivos y resuelve conflictos manualmente
# Busca estas marcas en el archivo:
# <<<<<<< HEAD
# tu código
# =======
# código de la otra rama
# >>>>>>> rama-nombre

# 3. Después de resolver, agregar archivos
git add archivo-resuelto.txt

# 4. Confirmar la fusión
git commit -m "Resolver conflictos de fusión"
```

## Recursos Adicionales

- Documentación oficial: https://git-scm.com/doc
- GitHub Guides: https://guides.github.com/
- Atlassian Git Tutorial: https://www.atlassian.com/git/tutorials
- Visualizador Git: https://git-school.github.io/visualizing-git/

## Cronograma para 4AMotos

### Semana 1: Configuración
- ✅ Instalar Git
- ✅ Configurar usuario
- ✅ Crear repositorio GitHub
- ✅ Primer commit

### Desarrollo continuo
- Commits diarios con cambios pequeños
- Crear ramas para funcionalidades grandes
- Documentar cambios importantes
- Hacer backup regular del repositorio

---

💡 Consejo: Practica estos comandos regularmente. Git es una herramienta fundamental que usarás durante toda tu carrera como desarrollador.

🎯 Meta para el proyecto: Al final del desarrollo, tu repositorio debe tener un historial limpio que muestre la evolución del proyecto semana por semana.
