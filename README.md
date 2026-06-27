# Buscando Juntos

Red comunitaria gratuita para ayudar a encontrar personas desaparecidas. Cualquiera puede crear un reporte con foto y última ubicación conocida; cualquiera puede marcar "la vi aquí" si tiene información.

## Lo que ya funciona en este código
- Pantalla de inicio con mapa de reportes activos + lista
- Formulario para crear un reporte nuevo (se guarda en una base de datos real)
- Pantalla de detalle con botón "La vi aquí" (registra avistamientos reales)

## Paso 1 — Instalar dependencias

Abre esta carpeta en VS Code, abre una terminal (`Ctrl + ñ` o `Terminal > New Terminal`) y corre:

```
npm install
```

## Paso 2 — Crear tu base de datos gratis en Supabase

1. Ve a [supabase.com](https://supabase.com) y crea una cuenta gratis.
2. Crea un nuevo proyecto (elige una contraseña para la base de datos y guárdala).
3. Cuando el proyecto esté listo, ve a **SQL Editor** (menú izquierdo).
4. Abre el archivo `supabase_setup.sql` de esta carpeta, copia todo su contenido, pégalo en el SQL Editor de Supabase y dale **Run**.
5. Ve a **Settings → API**. Copia dos valores:
   - **Project URL**
   - **anon public key**

## Paso 3 — Conectar tu app a Supabase

Abre el archivo `src/lib/supabaseClient.js` y reemplaza:

```js
const supabaseUrl = 'TU_SUPABASE_URL_AQUI'
const supabaseKey = 'TU_SUPABASE_ANON_KEY_AQUI'
```

con los valores reales que copiaste.

## Paso 4 — Probarlo en tu computadora

```
npm run dev
```

Abre el link que aparece (normalmente `http://localhost:5173`). Prueba crear un reporte y marcar "la vi aquí" — deberías verlo aparecer también dentro de tu proyecto de Supabase, en **Table Editor → reportes**.

## Paso 5 — Publicarlo gratis en Vercel

1. Sube esta carpeta a un repositorio nuevo en GitHub.
2. Ve a [vercel.com](https://vercel.com), crea cuenta gratis con tu GitHub.
3. Click en **Add New → Project**, elige tu repositorio.
4. Vercel detecta automáticamente que es un proyecto Vite — no cambies nada, click en **Deploy**.
5. En unos minutos tendrás un link real (ej. `buscando-juntos.vercel.app`) que cualquier persona puede abrir.

## Siguientes pasos sugeridos (no incluidos todavía)
- Subir fotos reales (hoy el campo `foto_url` existe en la base de datos pero no hay un selector de archivo en el formulario — se puede añadir con Supabase Storage, gratis también)
- Notificaciones cuando alguien reporta cerca de tu zona
- Verificación básica para evitar reportes falsos
- Convertirlo en app instalable (Android/iOS) con Capacitor

Dime cuál de estos quieres que construyamos primero.
