# Five-minute technical walkthrough

1. **Run the project.** Execute `npm ci`, `npm test`, and `npm start`. Show the portal and `/healthz`. Explain that the visible stages are configuration, while the Actions artifacts are actual evidence.
2. **Show secure application behavior.** Explain the fixed-route allowlist, CSP, safe text rendering, default loopback binding, and tests for hidden files and unsupported methods.
3. **Show the pipeline.** Open `.github/workflows/security.yml`. Explain independent source/IaC checks, the `needs` gate, the exact saved-image scan, and report uploads on failure.
4. **Show detection working.** Open the Semgrep fixture and its rule test output. Demonstrate that a dangerous pattern causes a scan failure. Do this on a temporary branch and retain a genuine CI run link.
5. **Discuss the boundary.** Explain why Juice Shop is isolated and why a vulnerable learning target can be audited while a first-party release blocks on findings. Explain what remains before production promotion.

## Resume wording

After you have personally run and understood the workflows, adapt this to match your actual work:

> Built a reproducible DevSecOps portfolio lab integrating Terraform/LocalStack, Kubernetes/Kind, and GitHub Actions security gates for SAST, dependency auditing, image scanning, SBOM generation, and passive DAST; documented risk acceptance and production promotion requirements.

Add numbers only when supported by your own run artifacts or measurements. Do not reuse the academic report's CVE counts, performance improvements, organization affiliation, or authorship.

## Questions to prepare for

- What does a green scan prove, and what does it leave uncertain?
- Why scan a saved image before running it?
- What is the difference between SAST, SCA, IaC analysis, and DAST?
- Why do scanner execution errors need different handling from vulnerability findings?
- What does a namespace isolate, and what requires a NetworkPolicy-enforcing CNI?
- How would you promote the same scanned image to production?
- Which implementation decisions did you make, and what assistance did you use?
