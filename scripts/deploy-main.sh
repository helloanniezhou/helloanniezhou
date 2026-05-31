#!/usr/bin/env bash
# Merge current branch into main and push (Vercel/GitHub Pages deploy on main).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

SKIP_BUILD=false
for arg in "$@"; do
  case "$arg" in
    --skip-build) SKIP_BUILD=true ;;
    -h|--help)
      echo "Usage: $(basename "$0") [--skip-build]"
      echo "  Runs production build, then pushes origin/main (merging current branch if needed)."
      exit 0
      ;;
  esac
done

REMOTE="${DEPLOY_REMOTE:-origin}"
MAIN_BRANCH="${DEPLOY_MAIN_BRANCH:-main}"

if ! git rev-parse --git-dir >/dev/null 2>&1; then
  echo "Error: not a git repository."
  exit 1
fi

if [ "$SKIP_BUILD" = false ]; then
  npm run build
fi

if [ -n "$(git status --porcelain)" ]; then
  echo "Error: working tree is not clean (including untracked files). Commit or stash first."
  exit 1
fi

CURRENT_BRANCH="$(git rev-parse --abbrev-ref HEAD)"

git fetch "$REMOTE" "$MAIN_BRANCH"

if [ "$CURRENT_BRANCH" = "$MAIN_BRANCH" ]; then
  git pull --ff-only "$REMOTE" "$MAIN_BRANCH"
  git push "$REMOTE" "$MAIN_BRANCH"
  echo "Pushed $REMOTE/$MAIN_BRANCH."
  exit 0
fi

git switch "$MAIN_BRANCH"
git pull --ff-only "$REMOTE" "$MAIN_BRANCH"
git merge "$CURRENT_BRANCH" --no-edit
git push "$REMOTE" "$MAIN_BRANCH"
git switch "$CURRENT_BRANCH"
echo "Merged $CURRENT_BRANCH into $MAIN_BRANCH and pushed $REMOTE/$MAIN_BRANCH."
