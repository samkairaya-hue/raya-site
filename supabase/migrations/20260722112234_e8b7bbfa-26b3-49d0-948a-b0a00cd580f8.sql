CREATE TABLE public.admin_auth (
  id integer PRIMARY KEY DEFAULT 1,
  password_hash text,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT admin_auth_single CHECK (id = 1)
);
GRANT ALL ON public.admin_auth TO service_role;
ALTER TABLE public.admin_auth ENABLE ROW LEVEL SECURITY;
INSERT INTO public.admin_auth (id) VALUES (1) ON CONFLICT DO NOTHING;