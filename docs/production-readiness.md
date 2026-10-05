# Production promotion checklist

The lab is not a production deployment. The first-party portal can serve as a starting point after the following environment-specific work is implemented and validated.

- [ ] All security workflow jobs pass on the release commit; archive the run URL and artifacts.
- [ ] Resolve findings rather than weakening the policy to obtain a green badge.
- [ ] Lock base images, scanner images, provider versions, and deployable application images to verified immutable references.
- [ ] Publish the exact scanned image digest; sign it and enforce signature/provenance validation at admission.
- [ ] Apply comprehensive infrastructure policy appropriate to the chosen provider, cluster, and threat model.
- [ ] Use an enforcing CNI, default-deny policies, workload identity, and least-privilege RBAC; verify actual network denial.
- [ ] Deploy behind TLS termination with a hostname, trusted certificates, rate limits, suitable HSTS, and ingress security controls.
- [ ] Implement alerts, structured operational logs, availability targets, and a tested rollback runbook.
- [ ] Measure resource usage, concurrency, and graceful shutdown under load.
- [ ] Use a production secret manager if private integrations are added; the portal currently needs no application secrets.
- [ ] Use a protected deployment environment, branch rules requiring checks, and reviewed release changes.
- [ ] If deploying real AWS resources, create a separate reviewed module with remote encrypted state, IAM, logs, backups, and cost controls. Do not turn the LocalStack module into a production module by merely changing endpoints.
- [ ] Remove Juice Shop and all lab exceptions from the release environment.

No image is automatically released by the current workflow. A hardened local manifest is not evidence of a production cluster's configuration.
