# Security policy and risk acceptance

## Blocking checks

- HTTP integration and syntax checks must pass.
- Custom Semgrep findings are errors. Rules are deliberately narrow and do not provide comprehensive SAST coverage.
- npm audit blocks HIGH/CRITICAL dependency findings. Zero dependencies is a scope reduction, not proof that the application has no vulnerabilities.
- Checkov runs the policy IDs listed in `security/checkov.yml`, covering non-root execution, probes, resource requests/limits, host namespaces, escalation, a read-only filesystem, dropped capabilities, service-account token mounting, and private subnet public-IP configuration. The vulnerable target is outside this policy scan.
- Trivy blocks all HIGH/CRITICAL vulnerabilities reported for the saved portal image, including unfixed findings. Remediation requires an updated base image or documented release decision.
- Syft inventory generation is required. An SBOM is an inventory, not a clean security result.
- Portal ZAP baseline blocks alerts through its normal exit behavior. It is a passive scan and does not demonstrate comprehensive authenticated or active DAST coverage.

## Lab-only risk register

| Risk / limited control | Scope and reason | Owner | Review trigger |
| --- | --- | --- | --- |
| Known application vulnerabilities | Juice Shop is intentionally vulnerable; never publicly exposed | Repository maintainer | Each lab run |
| Writable root filesystem | Juice Shop's SQLite runtime needs writes | Repository maintainer | Before any target-image update |
| Findings accepted in audit mode | Lab ZAP exit 1/2 indicates expected findings; exit 3 and other errors fail | Repository maintainer | Each scan report |
| Mutable image references | Local portal tag is loaded directly into Kind; scanner versions use tags | Repository maintainer | Before production promotion |
| Partial IaC policy | Only listed Checkov checks block; full CIS checks are outside the portable baseline | Repository maintainer | Before production promotion |
| No network policy enforcement | Portable lab assumes no verified enforcing CNI | Repository maintainer | Before running on shared infrastructure |
| Historical LocalStack version | Version-pinned compatibility lab; not a production AWS substitute | Repository maintainer | Before environment upgrades |

All current exceptions expire at production promotion: none authorizes production use. Any additional exception must name the policy ID, affected resource, justification, owner, expiry date, and compensating control. Do not suppress scanner execution failures.

## Reporting an issue

Use GitHub's private vulnerability reporting if the maintainer enables it. Otherwise contact the maintainer through their GitHub profile before publicly sharing a sensitive exploit. Never attach credentials or private scan data to a public issue.

GitHub Actions run with read-only repository permissions. The default workflow receives no cloud credentials. Do not execute untrusted fork code on a persistent self-hosted runner.
