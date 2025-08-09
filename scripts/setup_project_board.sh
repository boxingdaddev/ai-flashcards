#!/usr/bin/env bash
set -euo pipefail

# Projects v2 setup: create/find a user project and add labeled issues to it.
# Requires: gh (with scopes project, read:project). Run inside the target repo or set REPO.

NAME="${NAME:-StudyBuddy v0.3.1}"
DESC="${DESC:-Tasks for v0.3.1 release}"
LABEL="${LABEL:-v0.3.1}"
REPO="${REPO:-$(gh repo view --json nameWithOwner -q .nameWithOwner)}"

need(){ command -v "$1" >/dev/null || { echo "Missing: $1"; exit 1; }; }
need gh

# Who am I? (viewer)
OWNER_LOGIN="$(gh api graphql -f query='query{ viewer{login} }' --jq '.data.viewer.login')"
OWNER_ID="$(gh api graphql -f query='query{ viewer{id} }' --jq '.data.viewer.id')"

echo "Using repo: $REPO"
echo "Owner: $OWNER_LOGIN ($OWNER_ID)"
echo "Project title: $NAME"
echo "Selecting issues with label: $LABEL"

# Find existing project by title (pick newest/highest number)
FOUND="$(gh api graphql \
  -F login="$OWNER_LOGIN" \
  -f query='
    query($login:String!) {
      user(login:$login) {
        projectsV2(first:100) {
          nodes { id number title }
        }
      }
    }' \
  --jq '.data.user.projectsV2.nodes
        | map(select(.title=="'"$NAME"'"))
        | sort_by(.number)
        | last
        | if . then [.id,.number] | @tsv else empty end' || true)"

if [[ -n "$FOUND" ]]; then
  PROJECT_ID="$(echo "$FOUND" | cut -f1)"
  PROJECT_NUMBER="$(echo "$FOUND" | cut -f2)"
  echo "Using existing project: #$PROJECT_NUMBER ($PROJECT_ID)"
else
  echo "Project not found. Creating…"
  CREATED="$(gh api graphql \
    -F ownerId="$OWNER_ID" -F title="$NAME" \
    -f query='
      mutation($ownerId:ID!, $title:String!) {
        createProjectV2(input:{ownerId:$ownerId, title:$title}) {
          projectV2 { id number }
        }
      }' \
    --jq '.data.createProjectV2.projectV2 | [.id,.number] | @tsv')"
  PROJECT_ID="$(echo "$CREATED" | cut -f1)"
  PROJECT_NUMBER="$(echo "$CREATED" | cut -f2)"
  echo "Created project: #$PROJECT_NUMBER ($PROJECT_ID)"
fi


# Set/update description
gh api graphql \
  -F projectId="$PROJECT_ID" -F shortDescription="$DESC" \
  -f query='
    mutation($projectId:ID!, $shortDescription:String) {
      updateProjectV2(input:{projectId:$projectId, shortDescription:$shortDescription}) {
        projectV2 { id }
      }
    }' >/dev/null
echo "Description set."

# Collect all issues with the label from the repo (REST; returns GraphQL node_id)
ISSUE_LINES="$(gh api --paginate "repos/$REPO/issues?state=open&labels=$LABEL&per_page=100" \
  --jq '.[] | select(.pull_request | not) | [.node_id,.number] | @tsv' || true)"

if [[ -z "$ISSUE_LINES" ]]; then
  echo "No open issues with label '$LABEL' found in $REPO."
else
  echo "Adding issues to project:"
  while IFS=$'\t' read -r NODE_ID NUM; do
    [[ -z "$NODE_ID" ]] && continue
    gh api graphql \
      -F projectId="$PROJECT_ID" -F contentId="$NODE_ID" \
      -f query='
        mutation($projectId:ID!, $contentId:ID!) {
          addProjectV2ItemById(input:{projectId:$projectId, contentId:$contentId}) {
            item { id }
          }
        }' >/dev/null || true
    echo "  ✓ #$NUM added"
  done <<< "$ISSUE_LINES"
fi

echo
echo "Open your project:"
echo "  https://github.com/users/$OWNER_LOGIN/projects/$PROJECT_NUMBER"
