-- Optional: the website creates this table automatically on first use.
-- You can also run it once in Cloudflare Dashboard -> D1 -> your database -> Console.
CREATE TABLE IF NOT EXISTS enquiries (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  service TEXT NOT NULL,
  details TEXT NOT NULL,
  company TEXT NOT NULL DEFAULT '',
  budget TEXT NOT NULL DEFAULT 'Discuss with me',
  timeline TEXT NOT NULL DEFAULT 'Flexible',
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  status TEXT NOT NULL DEFAULT 'New'
);
CREATE INDEX IF NOT EXISTS enquiries_created_at_idx ON enquiries (created_at DESC);
