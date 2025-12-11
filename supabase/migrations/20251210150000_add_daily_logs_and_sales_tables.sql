-- Migration para adicionar tabelas de daily_logs e official_sales
-- Esta migration cria as tabelas necessárias para rastrear as vendas diárias dos distribuidores

-- Create daily_logs table
CREATE TABLE public.daily_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.User(id) ON DELETE CASCADE ON UPDATE CASCADE,
  date DATE NOT NULL,
  pairs_sold INTEGER DEFAULT 0,
  prospects_contacted INTEGER DEFAULT 0,
  activations INTEGER DEFAULT 0,
  type TEXT CHECK (type IN ('presential', 'online', 'mixed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create official_sales table
CREATE TABLE public.official_sales (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  distributor_id UUID NOT NULL REFERENCES public.User(id) ON DELETE CASCADE ON UPDATE CASCADE,
  quantity INTEGER NOT NULL,
  date DATE NOT NULL,
  timestamp BIGINT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_daily_logs_user_id ON public.daily_logs(user_id);
CREATE INDEX idx_daily_logs_date ON public.daily_logs(date);
CREATE INDEX idx_official_sales_distributor_id ON public.official_sales(distributor_id);
CREATE INDEX idx_official_sales_date ON public.official_sales(date);
CREATE INDEX idx_official_sales_timestamp ON public.official_sales(timestamp);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
CREATE TRIGGER update_daily_logs_updated_at
  BEFORE UPDATE ON public.daily_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_official_sales_updated_at
  BEFORE UPDATE ON public.official_sales
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Grant permissions
GRANT ALL ON TABLE public.daily_logs TO authenticated;
GRANT ALL ON TABLE public.official_sales TO authenticated;