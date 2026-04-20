# Security Policy

## Supported Versions

The `main` branch is the only actively maintained version. Security patches are backported to the most recent production release tag.

| Version | Supported |
|---------|-----------|
| main    | ✅ |
| < 1.0   | ❌ |

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

Send vulnerability reports to **security@zettaword.com**. Encrypt sensitive findings with our PGP key when available.

Include in your report:

1. Description of the vulnerability and its impact
2. Steps to reproduce (PoC if possible)
3. Affected versions / commits
4. Your suggested remediation (optional)

## Our Commitment

- **Acknowledgment** within 48 hours
- **Initial assessment** within 5 business days
- **Coordinated disclosure** with a 90-day embargo by default
- **Public credit** in our Hall of Fame (opt-in)
- **Bounty rewards** for qualifying findings

## Scope

**In-scope:**
- `*.zpad.io` web frontends and APIs
- `*.zettaword.com` production services
- Smart contracts deployed under ZETTA WORD governance

**Out-of-scope:**
- Social engineering (phishing, vishing, pretexting)
- Physical attacks against ZETTA WORD infrastructure
- Denial-of-service attacks
- Vulnerabilities in third-party dependencies that we have not yet had reasonable time to patch (report upstream first)
- Issues requiring physical access to a victim's device

## Safe Harbor

We will not pursue legal action against researchers who:

- Make a good-faith effort to avoid privacy violations, destruction of data, or service interruption
- Report findings promptly and privately
- Do not exploit vulnerabilities beyond what is necessary to demonstrate impact

Thank you for helping keep Z-PAD and the ZETTA ecosystem safe.
