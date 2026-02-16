#!/bin/bash
#
# Build and run the Docker image locally against the local PostgreSQL.
#
# Usage:
#   ./scripts/docker-local.sh              # build and run
#   ./scripts/docker-local.sh build        # build only
#   ./scripts/docker-local.sh build clean  # build from scratch (no cache)
#   ./scripts/docker-local.sh run          # run only (assumes image exists)
#
# The container runs on port 3003 to avoid conflicting with:
#   3000 - mphotos-ui dev server
#   3001 - sthlmschack-reimagined dev server
#   3002 - rockaden2 dev server
#   8060-8062 - nginx proxies
#

IMAGE_NAME="rockaden2"
HOST_PORT="3003"
CONTAINER_PORT="3002"

# On macOS, Docker reaches the host via host.docker.internal
DATABASE_URL="postgresql://rockadenadmin:rockaden123@host.docker.internal:5432/rockaden"
PAYLOAD_SECRET="rockaden-dev-secret-change-in-production"
SERVER_URL="http://localhost:${HOST_PORT}"

build() {
  local extra_args=""
  if [ "$1" = "clean" ]; then
    extra_args="--no-cache"
    echo "Building Docker image: ${IMAGE_NAME} (no cache)..."
  else
    echo "Building Docker image: ${IMAGE_NAME}..."
  fi
  docker build ${extra_args} -t "${IMAGE_NAME}" .
}

run() {
  echo "Running ${IMAGE_NAME} on http://localhost:${HOST_PORT}"
  echo "Press Ctrl+C to stop."
  docker run --rm -p "${HOST_PORT}:${CONTAINER_PORT}" \
    -e DATABASE_URL="${DATABASE_URL}" \
    -e PAYLOAD_SECRET="${PAYLOAD_SECRET}" \
    -e NEXT_PUBLIC_SERVER_URL="${SERVER_URL}" \
    "${IMAGE_NAME}"
}

case "${1}" in
  build)
    build "$2"
    ;;
  run)
    run
    ;;
  *)
    build "$2" && run
    ;;
esac
