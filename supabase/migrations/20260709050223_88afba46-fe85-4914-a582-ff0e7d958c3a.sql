
DROP POLICY IF EXISTS "Anyone can log consent" ON public.consent_events;
CREATE POLICY "Anon consent inserts" ON public.consent_events
  FOR INSERT TO anon
  WITH CHECK (user_id IS NULL);
CREATE POLICY "Auth consent inserts" ON public.consent_events
  FOR INSERT TO authenticated
  WITH CHECK (user_id IS NULL OR user_id = auth.uid());
