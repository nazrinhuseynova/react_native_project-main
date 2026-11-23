create table if not exists public.app_translations (
  code         text primary key,
  native_name  text not null,
  strings      jsonb not null,
  version      integer not null default 1,
  is_active    boolean not null default true,
  sort_order   integer not null default 0,
  updated_at   timestamptz not null default now()
);

alter table public.app_translations enable row level security;

drop policy if exists "app_translations_public_read" on public.app_translations;
create policy "app_translations_public_read"
  on public.app_translations
  for select
  to anon, authenticated
  using (is_active);

create or replace function public.bump_translation_version()
returns trigger
language plpgsql
as $$
begin
  if new.strings is distinct from old.strings then
    new.version := old.version + 1;
  end if;
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists trg_bump_translation_version on public.app_translations;
create trigger trg_bump_translation_version
  before update on public.app_translations
  for each row execute function public.bump_translation_version();