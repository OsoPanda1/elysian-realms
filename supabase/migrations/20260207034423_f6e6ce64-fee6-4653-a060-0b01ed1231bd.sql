
-- Fix remaining marketplace policies
DROP POLICY IF EXISTS "Sellers can delete own items" ON public.marketplace_items;

CREATE POLICY "Sellers can delete own items"
ON public.marketplace_items FOR DELETE
TO authenticated
USING (auth.uid() = seller_id);

-- Registry immutability
DROP POLICY IF EXISTS "Public can read registry" ON public.registry;
DROP POLICY IF EXISTS "Registry is immutable - no updates" ON public.registry;
DROP POLICY IF EXISTS "Registry is immutable - no deletes" ON public.registry;

CREATE POLICY "Public can read registry"
ON public.registry FOR SELECT
USING (true);

CREATE POLICY "Registry is immutable - no updates"
ON public.registry FOR UPDATE
TO authenticated
USING (false);

CREATE POLICY "Registry is immutable - no deletes"
ON public.registry FOR DELETE
TO authenticated
USING (false);
