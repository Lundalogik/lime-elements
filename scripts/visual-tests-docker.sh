#!/usr/bin/env bash
# Run the component example-tests (interaction + visual) inside the pinned
# Playwright Docker image. The screenshots are browser-driven, so the pixels are
# byte-identical to CI (same image, same Chromium); the Node/OS runtime also
# matches CI, which runs the same image. We install dependencies inside the
# container (npm ci) so the run does not depend on the host's node_modules (which
# on a macOS dev box contains macOS-native binaries).
#
# Prerequisite: the docs must already be built into www/ (the npm wrappers run
# `docs:rebuild` first). Requires Docker.
set -euo pipefail

# Keep this digest in lockstep with the @playwright/test version in package.json.
# The tag (v1.60.0-jammy) is the human-readable handle; the digest is what we
# actually pull, for supply-chain integrity. To rebump: docker pull <tag> then
# `docker inspect --format='{{index .RepoDigests 0}}' <tag>`.
IMAGE="mcr.microsoft.com/playwright@sha256:e1529a04087193966ea15d4a1617345bdaa0791690a24ab2c42b65f9ce5b2cdc"

# We run as root inside the container (the image default) so the anonymous
# node_modules volume and npm's HOME stay writable. The downside is that files
# the run writes into the bind-mounted repo (updated snapshots from
# :visual:update, test-results on failure) would be root-owned on a native Linux
# host, which breaks follow-up edits and Git. So we hand those back to the
# invoking user at the end (see the chown below). macOS bind mounts already remap
# to the host user, so there that step is a noop.
HOST_UID="$(id -u)"
HOST_GID="$(id -g)"

# Bind-mount the repo, but give the container its own node_modules (anonymous
# volume) so `npm ci` populates Linux binaries without clobbering the host's.
docker run --rm --init --ipc=host \
  -v "$PWD":/work \
  -v /work/node_modules \
  -w /work \
  -e RUN_VISUAL_SNAPSHOTS=1 \
  -e HOST_UID="$HOST_UID" \
  -e HOST_GID="$HOST_GID" \
  "$IMAGE" \
  bash -c '
    npm ci && npm run test:examples:components:ci -- "$@"
    status=$?
    # Re-own files written into the bind mount back to the host user. node_modules
    # is the discarded anonymous volume, so prune it; only files actually created
    # as root (-user 0) need touching, which makes this a noop on macOS.
    find /work -mindepth 1 -path /work/node_modules -prune -o -user 0 \
      -exec chown "$HOST_UID:$HOST_GID" {} + 2>/dev/null || true
    exit "$status"
  ' -- "$@"
