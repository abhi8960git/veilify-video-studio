#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
if curl -fsS http://localhost:3345 >/dev/null 2>&1; then
  exit 0
fi
nohup npm run dev:cloud > /tmp/veilify-studio.log 2>&1 < /dev/null &
echo "Veilify Studio starting on forwarded port 3345. Log: /tmp/veilify-studio.log"
