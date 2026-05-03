update public.templates
set
  output_filename_pattern = regexp_replace(output_filename_pattern, '^\d{2}-', ''),
  default_variables = regexp_replace(
    default_variables::text,
    '("output_filename"\s*:\s*")\d{2}-',
    E'\\1',
    'g'
  )::jsonb,
  updated_at = now()
where output_filename_pattern ~ '^\d{2}-'
   or default_variables::text ~ '("output_filename"\s*:\s*")\d{2}-';