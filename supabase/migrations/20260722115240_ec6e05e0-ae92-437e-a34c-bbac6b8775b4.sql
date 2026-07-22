UPDATE public.matrix_cards
SET target_body = regexp_replace(target_body, '\s*<nav class="sticky-nav">.*?</nav>\s*', E'\n', 'gs')
WHERE target_body LIKE '%<nav class="sticky-nav">%';