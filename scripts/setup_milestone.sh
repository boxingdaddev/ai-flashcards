#!/usr/bin/env bash
set -euo pipefail

# ----------------------------------------------------------------------------
# setup_milestone.sh
# Create (or find) a milestone and attach issues by label.
#
# Requirements:
#   - GitHub CLI installed: https://cli.github.com/
#   - Logged in: gh auth login
#   - Run from inside your repo (or set REPO="owner/repo")
#
# Config via environment variables (all optional):
#   TITLE         Milestone title (default: "v0.3.1")
#   DESCRIPTION   Milestone description (default: "Post–Safe Area Fix milestone")
#   DUE           ISO8601 UTC time, e.g. 2025-08-15T23:59:00Z (default: empty = no due date)
#   LABEL         Label to select issues for assignment (default: "v0.3.1")
#   REPO          owner/repo (auto-detected if not set)
# ----------------------------------------------------------------------------

TITLE="${TITLE:-v0.3.1}"
DESCRIPTION="${DESCRIPTION:-Post–Safe Area Fix milestone}"
DUE="${DUE:-}"
LABEL="${LABEL:-v0.3.1}"
REPO="${REPO:-}"

need() { command -v "$1" >/dev/null 2>&1 || { echo "Error: $1 not found. Please install it."; exit 1; }; }

need gh

if ! gh auth status >/dev/null 2>&1; then
  echo "You are not logged in. Run: gh auth login"
  exit 1
fi

if [[ -z "$REPO" ]]; then
  if gh repo view --json nameWithOwner >/dev/null 2>&1; then
    REPO="$(gh repo view --json nameWithOwner -q .nameWithOwner)"
  else
    echo "Unable to detect repo. Set REPO=\"owner/repo\" and retry."
    exit 1
  fi
fi

echo "Using repo: $REPO"
echo "Milestone title: $TITLE"
echo "Selecting issues with label: $LABEL"

# Check if milestone exists
MILESTONE_NUMBER="$(gh api "repos/$REPO/milestones" --paginate --jq ".[] | select(.title==\"$TITLE\").number" | head -n1 || true)"

if [[ -z "$MILESTONE_NUMBER" ]]; then
  echo "Milestone not found. Creating..."
  ARGS=( -X POST "repos/$REPO/milestones" -f "title=$TITLE" )
  [[ -n "$DESCRIPTION" ]] && ARGS+=( -f "description=$DESCRIPTION" )
  [[ -n "$DUE" ]] && ARGS+=( -f "due_on=$DUE" )
  gh api "${ARGS[@]}" >/dev/null
  MILESTONE_NUMBER="$(gh api "repos/$REPO/milestones" --jq ".[] | select(.title==\"$TITLE\").number" | head -n1)"
  echo "Created milestone #$MILESTONE_NUMBER ($TITLE)"
else
  echo "Found existing milestone #$MILESTONE_NUMBER ($TITLE)"
fi

# Assign issues
ISSUES="$(gh issue list --repo "$REPO" --label "$LABEL" --json number --jq '.[].number' || true)"

if [[ -z "$ISSUES" ]]; then
  echo "No issues found with label '$LABEL'."
  exit 0
fi

echo "Assigning milestone to issues: $ISSUES"
while IFS= read -r num; do
  [[ -z "$num" ]] && continue
  gh issue edit "$num" --repo "$REPO" --milestone "$TITLE" >/dev/null
  echo "  ✓ Issue #$num → milestone '$TITLE'"
done <<< "$ISSUES"

echo "Done. View milestone at: https://github.com/$REPO/milestones"
