#!/usr/bin/env sh
# Nightly / pre-deploy Postgres dump. NOT VERIFIED on real infrastructure.
# Usage: DATABASE_URL=postgres://... BACKUP_DIR=/backups deploy/backup.sh [label]
set -eu
: "${DATABASE_URL:?DATABASE_URL is required}"
BACKUP_DIR="${BACKUP_DIR:-/backups}"
LABEL="${1:-nightly}"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
FILE="$BACKUP_DIR/webdizayn-$LABEL-$STAMP.dump"

mkdir -p "$BACKUP_DIR"
umask 077
# Custom format: compressed, restorable table by table with pg_restore.
pg_dump --format=custom --no-owner --file="$FILE" "$DATABASE_URL"
# Fail loudly on an unreadable dump instead of discovering it during a restore.
pg_restore --list "$FILE" > /dev/null
echo "backup written: $FILE"

# Keep the 14 most recent nightly dumps locally; off-site copies follow their own policy.
if [ "$LABEL" = "nightly" ]; then
  ls -1t "$BACKUP_DIR"/webdizayn-nightly-*.dump 2>/dev/null | tail -n +15 | xargs -r rm -f
fi
