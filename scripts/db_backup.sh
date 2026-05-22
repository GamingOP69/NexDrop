#!/usr/bin/env bash
set -euo pipefail

# Simple PostgreSQL backup script. Expects DATABASE_URL in env.
OUT_DIR=${1:-./backups}
mkdir -p "$OUT_DIR"
TIMESTAMP=$(date -u +%Y%m%dT%H%M%SZ)
FILENAME="$OUT_DIR/nexdrop-db-$TIMESTAMP.sql.gz"

if [ -z "${DATABASE_URL:-}" ]; then
  echo "DATABASE_URL not set"
  exit 1
fi

echo "Creating DB dump to $FILENAME"
pg_dump "$DATABASE_URL" | gzip > "$FILENAME"
echo "Backup complete"
