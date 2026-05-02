alter type public.integration_provider add value if not exists 'sharepoint';
alter type public.integration_provider add value if not exists 'confluence';

alter table public.organization_integrations
  add column if not exists display_name text,
  add column if not exists provider_config jsonb not null default '{}'::jsonb;

create type public.publication_format as enum ('pdf', 'docx', 'html', 'confluence_page');
create type public.publication_status as enum ('queued', 'published', 'failed', 'superseded');

create table public.document_publications (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  document_id uuid not null references public.generated_docs(id) on delete cascade,
  revision_id uuid not null references public.document_revisions(id) on delete cascade,
  integration_id uuid not null references public.organization_integrations(id) on delete cascade,
  provider public.integration_provider not null,
  format public.publication_format not null,
  status public.publication_status not null default 'queued',
  external_document_id text,
  external_url text,
  external_version text,
  published_by uuid references auth.users(id) on delete set null,
  published_at timestamp with time zone,
  error_message text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

create index document_publications_org_idx on public.document_publications(organization_id, created_at desc);
create index document_publications_document_idx on public.document_publications(document_id, created_at desc);
create index document_publications_revision_idx on public.document_publications(revision_id);
create index document_publications_integration_idx on public.document_publications(integration_id, created_at desc);

create trigger document_publications_set_updated_at
before update on public.document_publications
for each row execute function public.set_updated_at();

alter table public.document_publications enable row level security;

create policy "Members can read document publications" on public.document_publications
  for select
  using (
    public.current_user_has_org_role(
      organization_id,
      array['admin', 'editor', 'viewer', 'approver']::public.org_role[]
    )
  );

create policy "Admins can manage document publications" on public.document_publications
  for all
  using (public.current_user_has_org_role(organization_id, array['admin']::public.org_role[]))
  with check (public.current_user_has_org_role(organization_id, array['admin']::public.org_role[]));