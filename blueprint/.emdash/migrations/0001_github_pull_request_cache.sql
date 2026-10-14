CREATE TABLE IF NOT EXISTS blueprint_github_pull_request_cache (
  cache_key TEXT PRIMARY KEY,
  payload TEXT NOT NULL,
  expires_at INTEGER
);
