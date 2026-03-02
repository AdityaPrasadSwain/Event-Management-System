-- ============================================
-- PRODUCTION-SAFE MIGRATION SCRIPT
-- Adding category_id to events table
-- ============================================

-- Step 1: Add category_id column as NULLABLE
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS category_id BIGINT;

-- Step 2: Create foreign key constraint (nullable for now)
ALTER TABLE events 
ADD CONSTRAINT fk_events_category 
FOREIGN KEY (category_id) REFERENCES categories(id)
ON DELETE RESTRICT;

-- Step 3: Assign default category to all existing events
-- First, ensure an "Uncategorized" or "General" category exists
INSERT INTO categories (name, description, created_at)
VALUES ('Uncategorized', 'Default category for migrated events', NOW())
ON CONFLICT (name) DO NOTHING;

-- Update all events with NULL category_id
UPDATE events 
SET category_id = (SELECT id FROM categories WHERE name = 'Uncategorized' LIMIT 1)
WHERE category_id IS NULL;

-- Step 4: Make the column NOT NULL after data is populated
ALTER TABLE events 
ALTER COLUMN category_id SET NOT NULL;

-- Verification queries
-- Check all events have a category
SELECT COUNT(*) as events_with_null_category 
FROM events 
WHERE category_id IS NULL;

-- Should return 0

-- View category distribution
SELECT c.name, COUNT(e.id) as event_count
FROM categories c
LEFT JOIN events e ON e.category_id = c.id
GROUP BY c.id, c.name
ORDER BY event_count DESC;
