#!/usr/bin/env bash
set -euo pipefail

# ------------------------------
# Batch-create StudyBuddy v0.3.1 issues with GitHub CLI
# Requirements:
#   - GitHub CLI installed: https://cli.github.com/
#   - Authenticated:        gh auth login
# ------------------------------

# ===== Config =====
# If you run this script inside your repo, it will auto-detect the "owner/repo".
# Otherwise, set REPO manually, e.g. REPO="yourname/yourrepo"
REPO="${REPO:-}"                 # optional override via env var
ASSIGNEE="${ASSIGNEE:-}"         # optional, e.g. export ASSIGNEE="your-github-username"
LABELS_DEFAULT="v0.3.1,enhancement"

# ===== Helpers =====
need() { command -v "$1" >/dev/null 2>&1 || { echo "Error: $1 not found. Please install it."; exit 1; }; }

detect_repo_from_git() {
  # Try to derive owner/repo from the current git remote
  if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    local url
    url="$(git remote get-url origin 2>/dev/null || true)"
    if [[ -n "$url" ]]; then
      # Supports both SSH and HTTPS remotes
      # Examples:
      #   git@github.com:owner/repo.git
      #   https://github.com/owner/repo.git
      if [[ "$url" =~ github\.com[:/]+([^/]+)/([^/.]+) ]]; then
        echo "${BASH_REMATCH[1]}/${BASH_REMATCH[2]}"
        return 0
      fi
    fi
  fi
  return 1
}

ensure_label() {
  local label="$1"
  local color="$2"    # hex without '#'
  local desc="$3"
  if ! gh label list --repo "$REPO" --limit 200 --json name | grep -q "\"$label\""; then
    gh label create "$label" --color "$color" --description "$desc" --repo "$REPO"
    echo "Created label: $label"
  else
    echo "Label exists: $label"
  fi
}

create_issue() {
  local title="$1"
  local body="$2"
  local labels="${3:-$LABELS_DEFAULT}"
  local assignee_flags=()
  if [[ -n "$ASSIGNEE" ]]; then
    assignee_flags+=(--assignee "$ASSIGNEE")
  fi
  gh issue create \
    --repo "$REPO" \
    --title "$title" \
    --label "$labels" \
    "${assignee_flags[@]}" \
    --body "$body"
}

# ===== Preflight =====
need gh

if ! gh auth status >/dev/null 2>&1; then
  echo "You are not logged in. Run: gh auth login"
  exit 1
fi

if [[ -z "$REPO" ]]; then
  if REPO_DETECTED="$(detect_repo_from_git)"; then
    REPO="$REPO_DETECTED"
    echo "Detected repo: $REPO"
  else
    echo "Unable to detect repo. Please set REPO environment variable, e.g.:"
    echo '  export REPO="owner/repo"'
    exit 1
  fi
else
  echo "Using REPO from env: $REPO"
fi

# Ensure labels exist
ensure_label "v0.3.1" "0366d6" "StudyBuddy v0.3.1 milestone work"
ensure_label "enhancement" "a2eeef" "New feature or request"

echo
echo "Creating issues in $REPO ..."
echo

# ===== Issues =====

create_issue "[v0.3.1] Safe Area strategy decision" "$(cat <<'EOF'
## Task
Decide on Safe Area approach (global NavigationContainer + SafeAreaProvider vs per-screen SafeAreaView).

## Effort
- [x] S
- [ ] M
- [ ] L

## Owner
Me (decision/code stub), You (approval)

## Scope
- Evaluate pros/cons of global vs per-screen Safe Area handling.
- Document decision in `README_DEV.md`.
- Implement skeleton for chosen approach.

## Deliverables
- PR with chosen approach in place (no visual change yet).
- Decision recorded in dev docs.

## Acceptance Criteria
- App compiles with chosen strategy applied.
- No regression in current layouts.
EOF
)"

create_issue "[v0.3.1] Implement Safe Area bg + StatusBar wiring" "$(cat <<'EOF'
## Task
Apply Safe Area bg and StatusBar style globally or per-screen.

## Effort
- [ ] S
- [x] M
- [ ] L

## Owner
Me

## Scope
- Apply theme bg color to top area.
- Wire StatusBar light/dark styles per theme.
- Ensure consistency on iOS + Android.

## Deliverables
- Solid top bg, no bleed.
- StatusBar matches design in both themes.

## Acceptance Criteria
- Verified visually on iOS/Android, light/dark.
- Hot reload stable.
EOF
)"

create_issue "[v0.3.1] Fix Folders return transition (no top flash/bleed)" "$(cat <<'EOF'
## Task
Fix Folders screen top bg when returning from SetDetails.

## Effort
- [x] S
- [ ] M
- [ ] L

## Owner
Me

## Scope
- Preserve bg color on back transition.
- Prevent flash/flicker.

## Deliverables
- PR with bg fix applied to return flow.

## Acceptance Criteria
- Back from SetDetails → Folders shows solid bg, no flicker after 5x rapid test.
EOF
)"

create_issue "[v0.3.1] RenameModal UX polish (focus, validation, submit)" "$(cat <<'EOF'
## Task
Improve RenameModal user experience.

## Effort
- [ ] S
- [x] M
- [ ] L

## Owner
Me

## Scope
- Auto-focus + select-all text.
- Input trim, collapse whitespace.
- Forbid empty or invalid names.
- Submit on Enter/Return.
- Haptic/toast feedback.
- Inline error on conflict.

## Deliverables
- PR with enhanced RenameModal.

## Acceptance Criteria
- Bad inputs rejected cleanly.
- Rename feels instant and smooth.
EOF
)"

create_issue "[v0.3.1] Duplicate/race-free renaming" "$(cat <<'EOF'
## Task
Prevent duplicate names and race conditions during rename.

## Effort
- [x] S
- [ ] M
- [ ] L

## Owner
Me

## Scope
- Ensure `getNextAvailableName()` applies (2), (3) consistently.
- Guard rapid double-submit.
- Use atomic storage writes.

## Deliverables
- PR with safe rename handling.

## Acceptance Criteria
- No dupes/crash when renaming quickly.
- Storage shows one final name.
EOF
)"

create_issue "[v0.3.1] Generation flow feedback + flicker kill" "$(cat <<'EOF'
## Task
Add visual feedback and remove flicker during set generation.

## Effort
- [ ] S
- [x] M
- [ ] L

## Owner
Me

## Scope
- Show overlay “Creating set…” until write resolves.
- Route to SetDetails after completion.
- Eliminate any transition flicker.

## Deliverables
- PR with feedback overlay + smooth transition.

## Acceptance Criteria
- On slow device, no partial renders.
- Overlay appears instantly after tap.
EOF
)"

create_issue "[v0.3.1] Back/gesture behavior & list state" "$(cat <<'EOF'
## Task
Preserve scroll + improve gesture handling.

## Effort
- [x] S
- [ ] M
- [ ] L

## Owner
Me

## Scope
- Save/restore Folders scroll position.
- Disable system back in RenameModal.
- Prevent double-pop on iOS swipe.

## Deliverables
- PR with navigation state fixes.

## Acceptance Criteria
- Scroll position preserved after open/back flow.
- RenameModal blocks system back.
EOF
)"

create_issue "[v0.3.1] Saved lists reactivity + long-name clamping" "$(cat <<'EOF'
## Task
Make Saved lists reactive and handle long names gracefully.

## Effort
- [x] S
- [ ] M
- [ ] L

## Owner
Me

## Scope
- Names update instantly without full refresh.
- Counters stay correct.
- Clamp long names without row height jitter.

## Deliverables
- PR with reactive updates + name clamping.

## Acceptance Criteria
- Rename long set: layout stable, counters correct.
EOF
)"

echo
echo "All issues created. You can view them with:"
echo "  gh issue list --repo \"$REPO\" --label v0.3.1 --limit 50"
