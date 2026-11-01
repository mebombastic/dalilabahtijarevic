CREATE TABLE public.pack_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pack_name TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity >= 1 AND quantity <= 20),
  listed_price TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.pack_orders ENABLE ROW LEVEL SECURITY;

-- Anyone can submit an order request from the website
CREATE POLICY "Anyone can submit an order"
  ON public.pack_orders
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    length(customer_name) BETWEEN 2 AND 80
    AND length(customer_email) BETWEEN 5 AND 160
    AND customer_email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND length(pack_name) BETWEEN 1 AND 200
    AND quantity BETWEEN 1 AND 20
  );

-- Only authenticated users can read orders (for a future admin view)
CREATE POLICY "Authenticated users can view orders"
  ON public.pack_orders
  FOR SELECT
  TO authenticated
  USING (true);