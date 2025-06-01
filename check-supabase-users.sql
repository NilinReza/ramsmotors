-- Check Supabase Auth Users Count
-- Run this in your Supabase SQL Editor

-- Count total auth users
SELECT COUNT(*) as total_users 
FROM auth.users;

-- Get detailed user information
SELECT 
    id,
    email,
    created_at,
    last_sign_in_at,
    email_confirmed_at,
    phone_confirmed_at
FROM auth.users
ORDER BY created_at DESC;

-- Count users by confirmation status
SELECT 
    CASE 
        WHEN email_confirmed_at IS NOT NULL THEN 'Confirmed'
        ELSE 'Unconfirmed'
    END as status,
    COUNT(*) as user_count
FROM auth.users
GROUP BY (email_confirmed_at IS NOT NULL);

-- Check admin users (if you have a custom admin_users table)
SELECT COUNT(*) as admin_users_count
FROM admin_users
WHERE is_active = true;
