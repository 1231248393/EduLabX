#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
rm -f "$ROOT/public/assets/mpmc/manual/mpmc-8085-introduction-manual.pdf"
rmdir "$ROOT/public/assets/mpmc/manual" 2>/dev/null || true
rm -f "$ROOT/public/assets/mpmc/photos/experiment-3-16bit-addition-source.jpg"
rm -f "$ROOT/public/assets/mpmc/photos/experiment-3-16bit-subtraction-source.jpg"
rm -f "$ROOT/public/assets/mpmc/photos/experiment-4-8bit-multiplication-source.jpg"
echo "MPMC obsolete scanned sheets and embedded PDF assets removed."
