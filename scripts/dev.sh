#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKEND_DIR="${JANESHELL_BACKEND_DIR:-/Users/bytedance/bs/janeshell_backend}"
BACKEND_CONDA_ENV="${JANESHELL_BACKEND_CONDA_ENV:-janeshell-backend}"
BACKEND_HOST="${JANESHELL_BACKEND_HOST:-127.0.0.1}"
BACKEND_PORT="${JANESHELL_BACKEND_PORT:-8000}"
START_BACKEND="${JANESHELL_START_BACKEND:-0}"

BACKEND_PID=""

cleanup() {
  if [[ -n "${BACKEND_PID}" ]] && kill -0 "${BACKEND_PID}" 2>/dev/null; then
    echo "[janeshell] stopping backend pid ${BACKEND_PID}"
    kill "${BACKEND_PID}" 2>/dev/null || true
    wait "${BACKEND_PID}" 2>/dev/null || true
  fi
}

find_conda() {
  if [[ -n "${CONDA_EXE:-}" && -x "${CONDA_EXE}" ]]; then
    echo "${CONDA_EXE}"
    return 0
  fi

  if command -v conda >/dev/null 2>&1; then
    command -v conda
    return 0
  fi

  for candidate in \
    "${HOME}/miniconda3/bin/conda" \
    "${HOME}/anaconda3/bin/conda" \
    "/opt/anaconda3/bin/conda" \
    "/opt/miniconda3/bin/conda"; do
    if [[ -x "${candidate}" ]]; then
      echo "${candidate}"
      return 0
    fi
  done

  return 1
}

backend_is_healthy() {
  curl -fsS -m 2 "http://${BACKEND_HOST}:${BACKEND_PORT}/health" >/dev/null 2>&1
}

start_backend() {
  if backend_is_healthy; then
    echo "[janeshell] backend already healthy at http://${BACKEND_HOST}:${BACKEND_PORT}"
    return 0
  fi

  local conda_bin
  if ! conda_bin="$(find_conda)"; then
    echo "[janeshell] conda not found. Please start backend manually or set CONDA_EXE." >&2
    return 1
  fi

  echo "[janeshell] starting backend with conda env '${BACKEND_CONDA_ENV}' on ${BACKEND_HOST}:${BACKEND_PORT}"
  (
    cd "${BACKEND_DIR}"
    "${conda_bin}" run --no-capture-output -n "${BACKEND_CONDA_ENV}" \
      uvicorn janeshell_backend.main:app --app-dir src --reload --host "${BACKEND_HOST}" --port "${BACKEND_PORT}"
  ) &
  BACKEND_PID="$!"

  for _ in {1..20}; do
    if backend_is_healthy; then
      echo "[janeshell] backend is ready"
      return 0
    fi
    sleep 0.5
  done

  echo "[janeshell] backend did not become healthy yet; frontend will still start and keep proxying to it." >&2
}

trap cleanup EXIT INT TERM

if [[ "${START_BACKEND}" == "1" || "${START_BACKEND}" == "true" || "${START_BACKEND}" == "yes" ]]; then
  start_backend
fi

cd "${ROOT_DIR}"
vite "$@"
