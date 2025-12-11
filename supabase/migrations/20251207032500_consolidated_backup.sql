-- Backup da migração consolidada - 07/12/2025
-- Esta é a versão oficial e funcional do esquema do banco de dados

-- Enable pgvector extension for vector database
CREATE EXTENSION IF NOT EXISTS vector;

-- Create User table (main user table)
CREATE TABLE public.User (
  id TEXT NOT NULL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  emailVerified TIMESTAMP WITH TIME ZONE,
  name TEXT,
  username TEXT UNIQUE,
  avatar TEXT,
  role TEXT DEFAULT 'USER',
  isActive BOOLEAN DEFAULT true,
  lastLoginAt TIMESTAMP WITH TIME ZONE,
  createdAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updatedAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create Account table (external authentication providers)
CREATE TABLE public.Account (
  id TEXT NOT NULL PRIMARY KEY,
  userId TEXT NOT NULL REFERENCES public.User(id) ON DELETE CASCADE ON UPDATE CASCADE,
  type TEXT NOT NULL,
  provider TEXT NOT NULL,
  providerAccountId TEXT NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at INTEGER,
  token_type TEXT,
  scope TEXT,
  id_token TEXT,
  session_state TEXT
);

-- Create unique index for Account provider + providerAccountId combination
CREATE UNIQUE INDEX idx_account_provider_provideraccountid ON public.Account(provider, providerAccountId);

-- Create Session table
CREATE TABLE public.Session (
  id TEXT NOT NULL PRIMARY KEY,
  sessionToken TEXT NOT NULL UNIQUE,
  userId TEXT NOT NULL REFERENCES public.User(id) ON DELETE CASCADE ON UPDATE CASCADE,
  expires TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Create VerificationToken table
CREATE TABLE public.VerificationToken (
  identifier TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  expires TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Create unique index for VerificationToken identifier + token combination
CREATE UNIQUE INDEX idx_verificationtoken_identifier_token ON public.VerificationToken(identifier, token);

-- Create UserSettings table
CREATE TABLE public.UserSettings (
  id TEXT NOT NULL PRIMARY KEY,
  userId TEXT NOT NULL UNIQUE REFERENCES public.User(id) ON DELETE CASCADE ON UPDATE CASCADE,
  theme TEXT DEFAULT 'system',
  language TEXT DEFAULT 'pt-BR',
  defaultTechnique TEXT DEFAULT 'auto',
  autoSave BOOLEAN DEFAULT true,
  showAdvanced BOOLEAN DEFAULT false,
  notifications JSONB DEFAULT '{}',
  preferences JSONB DEFAULT '{}',
  createdAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updatedAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create ApiKey table
CREATE TABLE public.ApiKey (
  id TEXT NOT NULL PRIMARY KEY,
  userId TEXT NOT NULL REFERENCES public.User(id) ON DELETE CASCADE ON UPDATE CASCADE,
  name TEXT NOT NULL,
  key TEXT NOT NULL UNIQUE,
  permissions JSONB DEFAULT '[]',
  lastUsedAt TIMESTAMP WITH TIME ZONE,
  expiresAt TIMESTAMP WITH TIME ZONE,
  isActive BOOLEAN DEFAULT true,
  usageCount INTEGER DEFAULT 0,
  rateLimit INTEGER DEFAULT 1000,
  createdAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updatedAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create Document table (for vector search/RAG)
CREATE TABLE public.Document (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  embedding VECTOR(1536),
  metadata JSONB DEFAULT '{}',
  createdAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updatedAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  userId TEXT REFERENCES public.User(id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- Create PromptHistory table (enhanced version)
CREATE TABLE public.PromptHistory (
  id TEXT NOT NULL PRIMARY KEY,
  userId TEXT NOT NULL REFERENCES public.User(id) ON DELETE CASCADE ON UPDATE CASCADE,
  role TEXT NOT NULL,
  objective TEXT NOT NULL,
  context TEXT NOT NULL,
  technique TEXT NOT NULL,
  generatedPrompt TEXT NOT NULL,
  detectedTags JSONB DEFAULT '[]',
  taskCount INTEGER DEFAULT 0,
  exampleCount INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  isFavorite BOOLEAN DEFAULT false,
  isPublic BOOLEAN DEFAULT false,
  usageCount INTEGER DEFAULT 0,
  version TEXT,
  createdAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updatedAt TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create prompt_embeddings table for vector search (RAG)
CREATE TABLE public.prompt_embeddings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  prompt_id TEXT NOT NULL REFERENCES public.PromptHistory(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES public.User(id) ON DELETE CASCADE,
  embedding VECTOR(1536),
  content_summary TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_account_provider ON public.Account(provider);
CREATE INDEX idx_account_userid ON public.Account(userId);
CREATE INDEX idx_apikey_expiresat ON public.ApiKey(expiresAt);
CREATE INDEX idx_apikey_isactive ON public.ApiKey(isActive);
CREATE INDEX idx_apikey_key ON public.ApiKey(key);
CREATE INDEX idx_apikey_userid ON public.ApiKey(userId);
CREATE INDEX idx_document_createdat ON public.Document(createdAt);
CREATE INDEX idx_document_userid ON public.Document(userId);
CREATE INDEX idx_prompthistory_createdat ON public.PromptHistory(createdAt);
CREATE INDEX idx_prompthistory_isfavorite ON public.PromptHistory(isFavorite);
CREATE INDEX idx_prompthistory_ispublic ON public.PromptHistory(isPublic);
CREATE INDEX idx_prompthistory_usagecount ON public.PromptHistory(usageCount);
CREATE INDEX idx_prompthistory_userid ON public.PromptHistory(userId);
CREATE INDEX idx_session_expires ON public.Session(expires);
CREATE INDEX idx_session_sessiontoken ON public.Session(sessionToken);
CREATE INDEX idx_session_userid ON public.Session(userId);
CREATE INDEX idx_user_createdat ON public.User(createdAt);
CREATE INDEX idx_user_email ON public.User(email);
CREATE INDEX idx_user_username ON public.User(username);
CREATE INDEX idx_usersettings_userid ON public.UserSettings(userId);

-- Create updated_at trigger function (using snake_case to match table columns)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updatedAt = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
CREATE TRIGGER update_user_updated_at
  BEFORE UPDATE ON public.User
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_usersettings_updated_at
  BEFORE UPDATE ON public.UserSettings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_apikey_updated_at
  BEFORE UPDATE ON public.ApiKey
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_document_updated_at
  BEFORE UPDATE ON public.Document
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_prompthistory_updated_at
  BEFORE UPDATE ON public.PromptHistory
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create updated_at trigger function for tables using snake_case (updated_at)
CREATE OR REPLACE FUNCTION public.update_updated_at_snake_case_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to search similar prompts using vector similarity
CREATE OR REPLACE FUNCTION public.search_similar_prompts(
  query_embedding VECTOR(1536),
  match_threshold FLOAT DEFAULT 0.7,
  match_count INT DEFAULT 5,
  p_user_id TEXT DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  prompt_id TEXT,
  content_summary TEXT,
  similarity FLOAT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    pe.id,
    pe.prompt_id,
    pe.content_summary,
    1 - (pe.embedding <=> query_embedding) as similarity
  FROM public.prompt_embeddings pe
  WHERE 
    (p_user_id IS NULL OR pe.user_id = p_user_id)
    AND 1 - (pe.embedding <=> query_embedding) > match_threshold
  ORDER BY pe.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Create index for vector similarity search
CREATE INDEX ON public.prompt_embeddings USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);