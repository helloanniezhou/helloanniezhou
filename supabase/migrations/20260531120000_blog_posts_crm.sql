-- Publish state for Notion case studies (CRM toggles via Vercel API + service role).

CREATE TABLE blog_posts (
  slug text PRIMARY KEY,
  published boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO blog_posts (slug, published) VALUES
  ('fitness-for-fitbit', true),
  ('airwallex', true),
  ('google-go', true)
ON CONFLICT (slug) DO NOTHING;

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Public site: anon may read only published posts.
CREATE POLICY "blog_posts_public_read"
  ON blog_posts FOR SELECT
  TO anon, authenticated
  USING (published = true);

CREATE OR REPLACE FUNCTION public.touch_blog_post_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.touch_blog_post_updated_at();
