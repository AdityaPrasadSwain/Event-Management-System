-- ============================================
-- DEV ENVIRONMENT - QUICK RESET
-- Drop and recreate tables (DATA LOSS!)
-- ============================================

-- WARNING: This will delete ALL existing data!
-- Only use in DEV environment

-- Drop tables in correct order (respect foreign keys)
DROP TABLE IF EXISTS attendance CASCADE;
DROP TABLE IF EXISTS feedback CASCADE;
DROP TABLE IF EXISTS tickets CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- After running this, restart Spring Boot with ddl-auto=create-drop
-- The schema will be recreated automatically
-- CategoryInitializer will seed default categories
-- DataInitializer will create admin user

-- Verify all tables are dropped
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Should return empty result set or only non-SEMS tables
