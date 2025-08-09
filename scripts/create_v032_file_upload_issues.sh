#!/usr/bin/env bash
set -euo pipefail

# Create v0.3.2 issues for file upload feature set using GitHub CLI (`gh`)
# Usage:
#   ./scripts/create_v032_file_upload_issues.sh
# Optional env:
#   REPO="owner/repo"   ASSIGNEE="your-username"

VERSION="v0.3.2"
LABELS_DEFAULT="$VERSION,enhancement"
REPO="${REPO:-$(gh repo view --json nameWithOwner -q .nameWithOwner)}"
ASSIGNEE="${ASSIGNEE:-}"

need(){ command -v "$1" >/dev/null || { echo "Missing: $1"; exit 1; }; }
need gh

# Ensure labels exist
ensure_label() {
  local label="$1" color="$2" desc="$3"
  gh label list --repo "$REPO" --limit 200 --json name | grep -q "\"$label\"" \
    || gh label create "$label" --color "$color" --description "$desc" --repo "$REPO" >/dev/null
}
ensure_label "$VERSION" "8250df" "New feature work for $VERSION"
ensure_label "enhancement" "a2eeef" "New feature or request"

create_issue() {
  local title="$1" body="$2" labels="${3:-$LABELS_DEFAULT}"
  local args=(--repo "$REPO" --title "$title" --label "$labels" --body "$body")
  [[ -n "$ASSIGNEE" ]] && args+=(--assignee "$ASSIGNEE")
  gh issue create "${args[@]}"
}

# 1) Client: File picker + chip UI (S)
create_issue "[$VERSION] Client: File picker + chip UI" $'## Task\nAdd PDF/DOCX file upload entry on Generate screen with a removable chip showing filename/size.\n\n## Effort\n- [x] S\n- [ ] M\n- [ ] L\n\n## Scope\n- Button: “Upload (PDF/DOCX)”.\n- Accept: application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document.\n- Show chip (name, size, remove).\n- Basic validation message for wrong type.\n\n## Deliverables\n- UI controls + basic validation wired (no network yet).\n\n## Acceptance Criteria\n- Can pick a file and see chip; removing clears selection.'

# 2) Client: Upload transport + progress (M)
create_issue "[$VERSION] Client: Upload transport + progress" $'## Task\nUpload file to /ingest with progress and error handling.\n\n## Effort\n- [ ] S\n- [x] M\n- [ ] L\n\n## Scope\n- Multipart/form-data POST -> /ingest (file, mime, size, plan).\n- Progress bar/cancel; clear errors for size/type/page-limit.\n- Store returned uploadId.\n\n## Deliverables\n- Network layer + progress UI + retry.\n\n## Acceptance Criteria\n- Slow network sim: progress visible; rejects oversize/unsupported files with friendly copy.'

# 3) Server: Ingest endpoint + validation (M)
create_issue "[$VERSION] Server: /ingest endpoint + validation" $'## Task\nCreate /ingest to receive file and enforce per-plan limits.\n\n## Effort\n- [ ] S\n- [x] M\n- [ ] L\n\n## Scope\n- Validate: MIME + magic bytes; size caps; page caps (PDF) before parse.\n- Persist upload meta: userId, plan, mime, size, pages?, charCount? (post-parse optional).\n- Return { uploadId, pages?, charCount? }.\n\n## Deliverables\n- Endpoint + tests for happy/limit/error paths.\n\n## Acceptance Criteria\n- Free vs Premium caps enforced; bad files 4xx with clear messages.'

# 4) Server: Parsers + sanitizer (PDF/DOCX → text) (M)
create_issue "[$VERSION] Server: Parsers + sanitizer (PDF/DOCX → text)" $'## Task\nParse uploads into clean text and normalize before generation.\n\n## Effort\n- [ ] S\n- [x] M\n- [ ] L\n\n## Scope\n- PDF: pypdf or pdfminer; DOCX: python-docx or mammoth.\n- Normalize whitespace; remove headers/footers/repeats; compute charCount.\n- Enforce text-length caps per plan (trim with note).\n\n## Deliverables\n- Parser module + unit tests on sample docs.\n\n## Acceptance Criteria\n- Known fixtures parse deterministically; over-cap inputs trimmed with reason.'

# 5) Server: Generator budget guard (caps + daily tokens) (M)
create_issue "[$VERSION] Server: Generator budget guard (caps + daily tokens)" $'## Task\nProtect backend by pre‑estimating tokens and enforcing output caps.\n\n## Effort\n- [ ] S\n- [x] M\n- [ ] L\n\n## Scope\n- Pre-estimate token cost; short‑circuit if > user/day budget; log reason.\n- Output caps/job: Free ≤ 60 cards; Premium ≤ 300 cards.\n- Respect lifetime Free cap (200 cards) and return remaining quota.\n\n## Deliverables\n- Guard utility + integration around LLM calls + logs/metrics.\n\n## Acceptance Criteria\n- Over‑budget requests return friendly message and do not hit LLM.'

# 6) Client: Generate-from-upload flow (S)
create_issue "[$VERSION] Client: Generate-from-upload flow" $'## Task\nCall /generate-from-upload and route to SetDetails with result state.\n\n## Effort\n- [x] S\n- [ ] M\n- [ ] L\n\n## Scope\n- POST { uploadId, promptHints? } -> /generate-from-upload.\n- Loading states: “Analyzing…”, “Generating…”.\n- Show truncation/limit notes if returned.\n\n## Deliverables\n- Integrated flow end-to-end (behind a feature flag if needed).\n\n## Acceptance Criteria\n- Happy path lands in SetDetails; errors surface with retry/learn-more.'

# 7) Server: Free-plan cap alignment (S)
create_issue "[$VERSION] Server: Free-plan cap alignment" $'## Task\nEnsure server-enforced Free limits mirror client: 1 file, ≤2MB, ≤20 pages, ≤8k chars post-parse, ≤60 cards/job, ≤200 lifetime.\n\n## Effort\n- [x] S\n- [ ] M\n- [ ] L\n\n## Scope\n- Centralize caps; return structured reason codes for UI messaging.\n\n## Deliverables\n- Config + tests + docs.\n\n## Acceptance Criteria\n- Caps toggleable per env; reasons consumed by client.'

# 8) Telemetry & Alerts (S)
create_issue "[$VERSION] Telemetry & Alerts" $'## Task\nAdd logging/metrics for uploads, parse size, token estimates/usage, truncation reasons; basic alerting on repeated limit hits.\n\n## Effort\n- [x] S\n- [ ] M\n- [ ] L\n\n## Scope\n- Structured logs; counters/histograms; simple alert thresholds.\n\n## Deliverables\n- Metrics dashboard stub + log fields documented.\n\n## Acceptance Criteria\n- Can answer: volumes by type/plan, avg chars/file, top rejection reasons.'

echo "All v0.3.2 issues created. Try: gh issue list --label $VERSION --limit 50"
