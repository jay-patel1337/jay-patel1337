#!/bin/sh
# Vercel "Ignored Build Step": exit 0 skips the deployment, exit 1 builds it.
# Any other exit code fails the deployment, so every path below ends in 0 or 1.
# Only redeploy when something Vercel serves has changed, so the bot's asset
# refreshes every 6 hours don't trigger builds.

# The snake on the output branch is served from raw.githubusercontent, not Vercel.
[ "$VERCEL_GIT_COMMIT_REF" = "output" ] && exit 0

prev="$VERCEL_GIT_PREVIOUS_SHA"
# First deployment, or a manual redeploy of the same commit: build.
if [ -z "$prev" ] || [ "$prev" = "$VERCEL_GIT_COMMIT_SHA" ]; then exit 1; fi

# Vercel clones only the last 10 commits, so once the bot has pushed more than that
# since the last real deploy, that commit is missing. Fetch it, or just build.
if ! git cat-file -e "$prev^{commit}" 2>/dev/null; then
  GIT_TERMINAL_PROMPT=0 git fetch -q --depth=1 origin "$prev" 2>/dev/null || exit 1
fi

git diff --quiet "$prev" HEAD -- api/ play/ scripts/lib/ scripts/vercel-ignore.sh package.json vercel.json && exit 0
exit 1
