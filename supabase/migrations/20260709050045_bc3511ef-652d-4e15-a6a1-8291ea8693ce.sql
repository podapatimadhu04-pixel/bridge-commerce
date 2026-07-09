
-- profiles
CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  preferred_lang TEXT DEFAULT 'en',
  preferred_currency TEXT DEFAULT 'USD',
  marketing_opt_in BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- addresses (delivery locations, any country)
CREATE TABLE public.addresses (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  label TEXT,
  recipient_name TEXT NOT NULL,
  phone TEXT,
  line1 TEXT NOT NULL,
  line2 TEXT,
  city TEXT NOT NULL,
  region TEXT,
  postal_code TEXT,
  country_code TEXT NOT NULL,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.addresses TO authenticated;
GRANT ALL ON public.addresses TO service_role;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own addresses" ON public.addresses FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX idx_addresses_user ON public.addresses(user_id);

-- orders
CREATE TABLE public.orders (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  code TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'placed',
  currency TEXT NOT NULL DEFAULT 'USD',
  subtotal_usd NUMERIC(12,2) NOT NULL DEFAULT 0,
  shipping_usd NUMERIC(12,2) NOT NULL DEFAULT 0,
  tax_usd NUMERIC(12,2) NOT NULL DEFAULT 0,
  total_usd NUMERIC(12,2) NOT NULL DEFAULT 0,
  address_id UUID REFERENCES public.addresses(id) ON DELETE SET NULL,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own orders" ON public.orders FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users insert own orders" ON public.orders FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE INDEX idx_orders_user ON public.orders(user_id);

-- consent log (GDPR/DPDP audit trail for cookie/marketing consent)
CREATE TABLE public.consent_events (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  anon_key TEXT,
  necessary BOOLEAN NOT NULL DEFAULT true,
  analytics BOOLEAN NOT NULL DEFAULT false,
  marketing BOOLEAN NOT NULL DEFAULT false,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.consent_events TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.consent_events TO authenticated;
GRANT ALL ON public.consent_events TO service_role;
ALTER TABLE public.consent_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can log consent" ON public.consent_events FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Users read own consent" ON public.consent_events FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.tg_set_updated_at() RETURNS TRIGGER
LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
CREATE TRIGGER trg_addresses_updated BEFORE UPDATE ON public.addresses FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
