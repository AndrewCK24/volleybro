CREATE TABLE IF NOT EXISTS blueprint_artifact_upload_budget (
  month TEXT PRIMARY KEY,
  baseline_state TEXT NOT NULL CHECK (baseline_state IN ('initializing', 'ready')),
  baseline_bytes INTEGER,
  reserved_bytes INTEGER NOT NULL DEFAULT 0 CHECK (reserved_bytes >= 0),
  class_a_requests INTEGER NOT NULL DEFAULT 0 CHECK (class_a_requests BETWEEN 0 AND 100000),
  lease_token TEXT,
  lease_expires_at INTEGER,
  CHECK (
    (baseline_state = 'initializing' AND baseline_bytes IS NULL AND lease_token IS NOT NULL AND lease_expires_at IS NOT NULL)
    OR
    (baseline_state = 'ready' AND baseline_bytes >= 0 AND lease_token IS NULL AND lease_expires_at IS NULL)
  )
);
