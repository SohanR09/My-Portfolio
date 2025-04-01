export const updateSchemaSQL = `
-- Add sequence column to about_items if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'about_items' AND column_name = 'sequence'
    ) THEN
        ALTER TABLE about_items ADD COLUMN sequence INTEGER DEFAULT 0;
        
        -- Update existing records with sequential values
        WITH indexed_rows AS (
            SELECT id, ROW_NUMBER() OVER () as row_num
            FROM about_items
        )
        UPDATE about_items
        SET sequence = indexed_rows.row_num
        FROM indexed_rows
        WHERE about_items.id = indexed_rows.id;
    END IF;
END $$;

-- Add sequence column to skills if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'skills' AND column_name = 'sequence'
    ) THEN
        ALTER TABLE skills ADD COLUMN sequence INTEGER DEFAULT 0;
        
        -- Update existing records with sequential values
        WITH indexed_rows AS (
            SELECT id, ROW_NUMBER() OVER () as row_num
            FROM skills
        )
        UPDATE skills
        SET sequence = indexed_rows.row_num
        FROM indexed_rows
        WHERE skills.id = indexed_rows.id;
    END IF;
END $$;

-- Add sequence column to experiences if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'experiences' AND column_name = 'sequence'
    ) THEN
        ALTER TABLE experiences ADD COLUMN sequence INTEGER DEFAULT 0;
        
        -- Update existing records with sequential values
        WITH indexed_rows AS (
            SELECT id, ROW_NUMBER() OVER () as row_num
            FROM experiences
        )
        UPDATE experiences
        SET sequence = indexed_rows.row_num
        FROM indexed_rows
        WHERE experiences.id = indexed_rows.id;
    END IF;
END $$;

-- Add sequence column to education if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'education' AND column_name = 'sequence'
    ) THEN
        ALTER TABLE education ADD COLUMN sequence INTEGER DEFAULT 0;
        
        -- Update existing records with sequential values
        WITH indexed_rows AS (
            SELECT id, ROW_NUMBER() OVER () as row_num
            FROM education
        )
        UPDATE education
        SET sequence = indexed_rows.row_num
        FROM indexed_rows
        WHERE education.id = indexed_rows.id;
    END IF;
END $$;

-- Add sequence column to projects if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'projects' AND column_name = 'sequence'
    ) THEN
        ALTER TABLE projects ADD COLUMN sequence INTEGER DEFAULT 0;
        
        -- Update existing records with sequential values
        WITH indexed_rows AS (
            SELECT id, ROW_NUMBER() OVER () as row_num
            FROM projects
        )
        UPDATE projects
        SET sequence = indexed_rows.row_num
        FROM indexed_rows
        WHERE projects.id = indexed_rows.id;
    END IF;
END $$;

-- Add sequence column to blog_categories if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'blog_categories' AND column_name = 'sequence'
    ) THEN
        ALTER TABLE blog_categories ADD COLUMN sequence INTEGER DEFAULT 0;
        
        -- Update existing records with sequential values
        WITH indexed_rows AS (
            SELECT id, ROW_NUMBER() OVER () as row_num
            FROM blog_categories
        )
        UPDATE blog_categories
        SET sequence = indexed_rows.row_num
        FROM indexed_rows
        WHERE blog_categories.id = indexed_rows.id;
    END IF;
END $$;

-- Add sequence column to blog_posts if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'blog_posts' AND column_name = 'sequence'
    ) THEN
        ALTER TABLE blog_posts ADD COLUMN sequence INTEGER DEFAULT 0;
        
        -- Update existing records with sequential values
        WITH indexed_rows AS (
            SELECT id, ROW_NUMBER() OVER () as row_num
            FROM blog_posts
        )
        UPDATE blog_posts
        SET sequence = indexed_rows.row_num
        FROM indexed_rows
        WHERE blog_posts.id = indexed_rows.id;
    END IF;
END $$;

-- Create a function to update sequence numbers
CREATE OR REPLACE FUNCTION update_sequence(
    p_table_name TEXT,
    p_id TEXT,
    p_new_sequence INTEGER
)
RETURNS VOID AS $$
DECLARE
    old_sequence INTEGER;
    min_seq INTEGER;
    max_seq INTEGER;
BEGIN
    -- Get the current sequence of the item
    EXECUTE format('SELECT sequence FROM %I WHERE id = $1', p_table_name)
    INTO old_sequence
    USING p_id;
    
    -- Get the min and max sequence values
    EXECUTE format('SELECT MIN(sequence), MAX(sequence) FROM %I', p_table_name)
    INTO min_seq, max_seq;
    
    -- Ensure new sequence is within bounds
    IF p_new_sequence < min_seq THEN
        p_new_sequence := min_seq;
    ELSIF p_new_sequence > max_seq THEN
        p_new_sequence := max_seq;
    END IF;
    
    -- Update sequences
    IF old_sequence < p_new_sequence THEN
        -- Moving down in the list (higher sequence number)
        EXECUTE format('
            UPDATE %I
            SET sequence = sequence - 1
            WHERE sequence > $1 AND sequence <= $2
        ', p_table_name)
        USING old_sequence, p_new_sequence;
    ELSIF old_sequence > p_new_sequence THEN
        -- Moving up in the list (lower sequence number)
        EXECUTE format('
            UPDATE %I
            SET sequence = sequence + 1
            WHERE sequence >= $1 AND sequence < $2
        ', p_table_name)
        USING p_new_sequence, old_sequence;
    END IF;
    
    -- Set the new sequence for the item
    EXECUTE format('
        UPDATE %I
        SET sequence = $1
        WHERE id = $2
    ', p_table_name)
    USING p_new_sequence, p_id;
END;
$$ LANGUAGE plpgsql;

-- Create a function to execute SQL
CREATE OR REPLACE FUNCTION execute_sql(sql TEXT)
RETURNS VOID AS $$
BEGIN
    EXECUTE sql;
END;
$$ LANGUAGE plpgsql;
`

