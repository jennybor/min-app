-- Tabell for klikkdata fra brukertesting.
create table public.klikk (
  id bigint generated always as identity primary key,
  opprettet timestamptz not null default now(),
  okt text not null,
  hendelse text not null,
  detaljer jsonb
);

-- Row Level Security: appen kan bare legge inn klikk, ikke lese dem.
-- Klikkene leses i Supabase-dashbordet.
alter table public.klikk enable row level security;

create policy "Appen kan legge inn klikk"
  on public.klikk for insert
  to anon
  with check (true);

grant insert on public.klikk to anon;
