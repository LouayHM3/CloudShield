#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
for tool in docker kind kubectl terraform curl; do
  command -v "$tool" >/dev/null || { echo "Missing prerequisite: $tool" >&2; exit 1; }
done
docker compose --profile lab up -d localstack
ready=false
for attempt in {1..60}; do
  if curl -fsS http://127.0.0.1:4566/_localstack/health >/dev/null; then ready=true; break; fi
  sleep 2
done
[[ "$ready" == true ]] || { echo "LocalStack did not become ready" >&2; exit 1; }
terraform -chdir=infra/local init
terraform -chdir=infra/local apply -auto-approve
if ! kind get clusters | grep -qx cloudshield; then kind create cluster --name cloudshield --wait 120s; fi
docker build -t cloudshield:local .
kind load docker-image cloudshield:local --name cloudshield
kubectl --context kind-cloudshield apply -f k8s/portal.yaml
kubectl --context kind-cloudshield -n cloudshield rollout status deployment/portal --timeout=120s
echo 'Portal ready. Run: kubectl --context kind-cloudshield -n cloudshield port-forward svc/portal 3000:3000'
echo 'Optional vulnerable target: kubectl --context kind-cloudshield apply -f lab/juice-shop.yaml'
