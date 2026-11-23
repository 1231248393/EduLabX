#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT="${HOME}/college-portal-temp"
TARGET="${PROJECT}/app/labs/[labSlug]/experiment/[expId]"
SOURCE="${ROOT}/EduLabX/app/labs/[labSlug]/experiment/[expId]"
if [[ ! -d "$PROJECT" || ! -d "$TARGET" ]]; then
  echo "ERROR: Expected EduLabX project/experiment folder was not found:"
  echo "  $TARGET"
  exit 1
fi
STAMP="$(date +%Y%m%d_%H%M%S)"
for file in MPMC8051Simulator.tsx MPMCSimulator.tsx MC51VirtualTrainer.tsx; do
  [[ -f "$SOURCE/$file" ]] || { echo "ERROR: Missing patch file $SOURCE/$file"; exit 1; }
done
BACKUP="${PROJECT}/.backup_mpmc8051_${STAMP}"
mkdir -p "$BACKUP"
for file in MPMC8051Simulator.tsx MPMCSimulator.tsx MC51VirtualTrainer.tsx; do
  cp -a "$TARGET/$file" "$BACKUP/$file"
  cp -a "$SOURCE/$file" "$TARGET/$file"
  echo "Updated: $TARGET/$file"
done
echo
echo "Patch installed. Original files backed up to: $BACKUP"
echo "Next run:"
echo "  cd \"$PROJECT\""
echo "  pnpm build"
