-- Add sequence field to projects table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'projects' AND column_name = 'sequence'
    ) THEN
        ALTER TABLE projects ADD COLUMN sequence INTEGER;
        -- Initialize sequence values based on created_at
        UPDATE projects SET sequence = subquery.row_num - 1
        FROM (
            SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) as row_num
            FROM projects
        ) AS subquery
        WHERE projects.id = subquery.id;
    END IF;
END $$;

-- Add sequence field to experiences table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'experiences' AND column_name = 'sequence'
    ) THEN
        ALTER TABLE experiences ADD COLUMN sequence INTEGER;
        -- Initialize sequence values based on created_at
        UPDATE experiences SET sequence = subquery.row_num - 1
        FROM (
            SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) as row_num
            FROM experiences
        ) AS subquery
        WHERE experiences.id = subquery.id;
    END IF;
END $$;

-- Add sequence field to education table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'education' AND column_name = 'sequence'
    ) THEN
        ALTER TABLE education ADD COLUMN sequence INTEGER;
        -- Initialize sequence values based on created_at
        UPDATE education SET sequence = subquery.row_num - 1
        FROM (
            SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) as row_num
            FROM education
        ) AS subquery
        WHERE education.id = subquery.id;
    END IF;
END $$;

-- Add sequence field to skills table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'skills' AND column_name = 'sequence'
    ) THEN
        ALTER TABLE skills ADD COLUMN sequence INTEGER;
        -- Initialize sequence values based on created_at
        UPDATE skills SET sequence = subquery.row_num - 1
        FROM (
            SELECT id, ROW_NUMBER() OVER (ORDER BY name) as row_num
            FROM skills
        ) AS subquery
        WHERE skills.id = subquery.id;
    END IF;
END $$;

-- Add sequence field to about_items table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'about_items' AND column_name = 'sequence'
    ) THEN
        ALTER TABLE about_items ADD COLUMN sequence INTEGER;
        -- Initialize sequence values based on created_at
        UPDATE about_items SET sequence = subquery.row_num - 1
        FROM (
            SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) as row_num
            FROM about_items
        ) AS subquery
        WHERE about_items.id = subquery.id;
    END IF;
END $$;

-- Add sequence field to blog_posts table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'blog_posts' AND column_name = 'sequence'
    ) THEN
        ALTER TABLE blog_posts ADD COLUMN sequence INTEGER;
        -- Initialize sequence values based on date
        UPDATE blog_posts SET sequence = subquery.row_num - 1
        FROM (
            SELECT id, ROW_NUMBER() OVER (ORDER BY date DESC) as row_num
            FROM blog_posts
        ) AS subquery
        WHERE blog_posts.id = subquery.id;
    END IF;
END $$;

-- Add sequence field to blog_categories table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'blog_categories' AND column_name = 'sequence'
    ) THEN
        ALTER TABLE blog_categories ADD COLUMN sequence INTEGER;
        -- Initialize sequence values based on name
        UPDATE blog_categories SET sequence = subquery.row_num - 1
        FROM (
            SELECT id, ROW_NUMBER() OVER (ORDER BY name) as row_num
            FROM blog_categories
        ) AS subquery
        WHERE blog_categories.id = subquery.id;
    END IF;
END $$;

