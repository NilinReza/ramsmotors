-- Create admin user in Supabase Auth
-- Run this in Supabase SQL Editor

-- Insert admin user into auth.users
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@ramsmotors.com',
  crypt('password123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);

-- Insert into auth.identities
INSERT INTO auth.identities (
  id,
  user_id,
  provider_id,
  provider,
  identity_data,
  created_at,
  updated_at
) SELECT 
  gen_random_uuid(),
  id,
  id::text,
  'email',
  format('{"sub":"%s","email":"%s"}', id::text, email)::jsonb,
  NOW(),
  NOW()
FROM auth.users 
WHERE email = 'admin@ramsmotors.com';
