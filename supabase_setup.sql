-- INSTRUCCIONES:
-- 1. Entra a tu proyecto en supabase.com
-- 2. Ve a "SQL Editor" en el menú de la izquierda
-- 3. Pega TODO este archivo y dale click a "Run"

-- Tabla principal de reportes de personas desaparecidas
create table reportes (
  id uuid default gen_random_uuid() primary key,
  creado_en timestamp with time zone default now(),
  nombre text not null,
  edad int,
  descripcion text,
  foto_url text,
  ultima_ubicacion_lat float not null,
  ultima_ubicacion_lng float not null,
  ultima_ubicacion_texto text,
  fecha_desaparicion date,
  contacto text not null,
  estado text default 'activo'
);

-- Tabla de avistamientos ("lo vi aquí")
create table avistamientos (
  id uuid default gen_random_uuid() primary key,
  creado_en timestamp with time zone default now(),
  reporte_id uuid references reportes(id) on delete cascade,
  lat float not null,
  lng float not null,
  comentario text,
  contacto_testigo text
);

-- Seguridad: permite que cualquiera lea y cree reportes
-- (apropiado para una app pública de ayuda comunitaria;
--  más adelante se puede restringir con autenticación)
alter table reportes enable row level security;
alter table avistamientos enable row level security;

create policy "Cualquiera puede ver reportes"
  on reportes for select using (true);

create policy "Cualquiera puede crear reportes"
  on reportes for insert with check (true);

create policy "Cualquiera puede ver avistamientos"
  on avistamientos for select using (true);

create policy "Cualquiera puede crear avistamientos"
  on avistamientos for insert with check (true);
