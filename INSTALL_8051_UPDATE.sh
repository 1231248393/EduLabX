#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
HOME_DIR="$HOME"
EDU="$HOME_DIR/college-portal-temp"
CW="$HOME_DIR/circuitweb-clone"

for d in "$EDU" "$CW"; do
  if [[ ! -d "$d" ]]; then echo "Missing project directory: $d"; exit 1; fi
done

copy_file() {
  local src="$1" dst="$2"
  mkdir -p "$(dirname "$dst")"
  cp -f "$src" "$dst"
  echo "Updated: $dst"
}

copy_file "$ROOT/circuitweb-clone/client/src/components/SandboxUI.jsx" "$CW/client/src/components/SandboxUI.jsx"
copy_file "$ROOT/circuitweb-clone/client/src/components/CircuitIcons.jsx" "$CW/client/src/components/CircuitIcons.jsx"
copy_file "$ROOT/circuitweb-clone/client/src/components/metadata.js" "$CW/client/src/components/metadata.js"
copy_file "$ROOT/college-portal-temp/data/mpmcExperiments.ts" "$EDU/data/mpmcExperiments.ts"
copy_file "$ROOT/college-portal-temp/public/assets/mpmc/diagrams/8051-led-interface.svg" "$EDU/public/assets/mpmc/diagrams/8051-led-interface.svg"
copy_file "$ROOT/college-portal-temp/public/assets/mpmc/diagrams/8051-lcd-16x2-interface.svg" "$EDU/public/assets/mpmc/diagrams/8051-lcd-16x2-interface.svg"

echo
echo "8051 source update copied. No existing project folders were deleted."
echo "Next: build both projects using the commands in the update instructions."
