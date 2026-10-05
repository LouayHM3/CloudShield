#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p reports
chmod 777 reports
kubectl --context kind-cloudshield -n cloudshield-target port-forward svc/juice-shop 3001:3000 >reports/port-forward.log 2>&1 &
tunnel_pid=$!
trap 'kill "$tunnel_pid" 2>/dev/null || true' EXIT
ready=false
for attempt in {1..60}; do
  if curl -fsS http://127.0.0.1:3001 >/dev/null; then ready=true; break; fi
  kill -0 "$tunnel_pid" || { cat reports/port-forward.log; exit 1; }
  sleep 2
done
[[ "$ready" == true ]] || { echo 'Target did not become ready' >&2; exit 1; }
set +e
docker run --rm --network host -v "$PWD/reports:/zap/wrk:rw" ghcr.io/zaproxy/zaproxy:2.16.1 \
  zap-baseline.py -t http://127.0.0.1:3001 -J juice-shop-zap.json -r juice-shop-zap.html
result=$?
set -e
case "$result" in
  0) echo 'Lab baseline completed without alerts.' ;;
  1|2) echo 'Expected vulnerable-lab findings: review reports/juice-shop-zap.html.' ;;
  *) echo "Scanner execution failed ($result)" >&2; exit "$result" ;;
esac
