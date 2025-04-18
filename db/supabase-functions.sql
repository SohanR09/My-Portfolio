-- Function to create the updated_at trigger function
CREATE OR REPLACE FUNCTION create_updated_at_function()
RETURNS void AS $$
BEGIN
  CREATE OR REPLACE FUNCTION update_updated_at_column()
  RETURNS TRIGGER AS $trigger$
  BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
  END;
  $trigger$ LANGUAGE plpgsql;
END;
$$ LANGUAGE plpgsql;

-- Function to enable RLS on a table
CREATE OR REPLACE FUNCTION enable_rls(table_name text)
RETURNS void AS $$
BEGIN
  EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', table_name);
END;
$$ LANGUAGE plpgsql;

-- Function to create a read policy for a table
CREATE OR REPLACE FUNCTION create_read_policy(table_name text, policy_name text)
RETURNS void AS $$
BEGIN
  EXECUTE format('DROP POLICY IF EXISTS %I ON %I', policy_name, table_name);
  EXECUTE format('CREATE POLICY %I ON %I FOR SELECT USING (true)', policy_name, table_name);
END;
$$ LANGUAGE plpgsql;

-- Function to create a write policy for a table
CREATE OR REPLACE FUNCTION create_write_policy(table_name text, policy_name text)
RETURNS void AS $$
BEGIN
  EXECUTE format('DROP POLICY IF EXISTS %I ON %I', policy_name, table_name);
  EXECUTE format('CREATE POLICY %I ON %I USING (auth.role() = ''authenticated'') WITH CHECK (auth.role() = ''authenticated'')', policy_name, table_name);
END;
$$ LANGUAGE plpgsql;

-- Function to create about_items table
CREATE OR REPLACE FUNCTION create_about_items_table()
RETURNS void AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS about_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    icon TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
  
  -- Create trigger for updated_at
  DROP TRIGGER IF EXISTS update_about_items_updated_at ON about_items;
  CREATE TRIGGER update_about_items_updated_at
  BEFORE UPDATE ON about_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
END;
$$ LANGUAGE plpgsql;

-- Function to create skills table
CREATE OR REPLACE FUNCTION create_skills_table()
RETURNS void AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    icon TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
  
  -- Create trigger for updated_at
  DROP TRIGGER IF EXISTS update_skills_updated_at ON skills;
  CREATE TRIGGER update_skills_updated_at
  BEFORE UPDATE ON skills
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
END;
$$ LANGUAGE plpgsql;

-- Function to create experiences table
CREATE OR REPLACE FUNCTION create_experiences_table()
RETURNS void AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS experiences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company TEXT NOT NULL,
    logo TEXT,
    position TEXT NOT NULL,
    period TEXT NOT NULL,
    description TEXT NOT NULL,
    skills TEXT[] NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
  
  -- Create trigger for updated_at
  DROP TRIGGER IF EXISTS update_experiences_updated_at ON experiences;
  CREATE TRIGGER update_experiences_updated_at
  BEFORE UPDATE ON experiences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
END;
$$ LANGUAGE plpgsql;

-- Function to create education table
CREATE OR REPLACE FUNCTION create_education_table()
RETURNS void AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS education (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    university TEXT NOT NULL,
    logo TEXT,
    degree TEXT NOT NULL,
    period TEXT NOT NULL,
    cgpa TEXT NOT NULL,
    subjects TEXT[] NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
  
  -- Create trigger for updated_at
  DROP TRIGGER IF EXISTS update_education_updated_at ON education;
  CREATE TRIGGER update_education_updated_at
  BEFORE UPDATE ON education
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
END;
$$ LANGUAGE plpgsql;

-- Function to create projects table
CREATE OR REPLACE FUNCTION create_projects_table()
RETURNS void AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    image TEXT,
    skills TEXT[] NOT NULL,
    github TEXT,
    live TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
  
  -- Create trigger for updated_at
  DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
  CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
END;
$$ LANGUAGE plpgsql;

-- Function to create blog_categories table
CREATE OR REPLACE FUNCTION create_blog_categories_table()
RETURNS void AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS blog_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    icon TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
  
  -- Create trigger for updated_at
  DROP TRIGGER IF EXISTS update_blog_categories_updated_at ON blog_categories;
  CREATE TRIGGER update_blog_categories_updated_at
  BEFORE UPDATE ON blog_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
END;
$$ LANGUAGE plpgsql;

-- Function to create blog_posts table
CREATE OR REPLACE FUNCTION create_blog_posts_table()
RETURNS void AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    image TEXT,
    date TEXT NOT NULL,
    author TEXT NOT NULL,
    author_image TEXT,
    category_id UUID REFERENCES blog_categories(id),
    read_time TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
  
  -- Create trigger for updated_at
  DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
  CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
END;
$$ LANGUAGE plpgsql;

