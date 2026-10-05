#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
# Teardown applies only to resources explicitly named by this lab.
terraform -chdir=infra/local destroy -auto-approve
if kind get clusters | grep -qx cloudshield; then kind delete cluster --name cloudshield; fi
docker compose --profile lab stop localstack
