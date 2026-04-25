# Physical Security Policy

> Baseline reviewer copy. Handlebars placeholders such as `{{organization_name}}` are intentionally preserved so this can be reviewed before organization-specific answers are inserted.

<!-- Mapping: CC6.1, CC6.2, CC6.3, CC6.4, CC6.5, CC6.6, CC6.7, CC6.8 -->

| Field | Value |
| --- | --- |
| Template slug | `physical-security-policy` |
| TSC category | Security |
| Criteria mapped | CC6 |
| Purpose | Physical access expectations for offices, devices, and on-premise assets. |
| Output filename | `13-physical-security-policy.md` |

---

---
title: Physical Security Policy
slug: physical-security-policy
tsc_category: Security
criteria_mapped:
  - CC6
generated_for: {{organization_name}}
effective_date: {{effective_date}}
version: {{policy_version}}
---

<!-- Mapping: CC6 -->

# Physical Security Policy

## Control Ownership
- Policy Owner: {{policy_owner}}
- Control Operator: {{control_operator}}


## Purpose
{{organization_name}} protects offices, devices, and physical assets from unauthorized access and damage.

## Requirements
- Company-issued devices must use screen locks and full-disk encryption.
- Visitors to controlled spaces must be escorted.
- Disposal of media and equipment follows documented sanitization procedures.

{{#if is_self_hosted}}
## Self-Hosted Facilities
{{#if has_physical_server_room}}
- Server rooms, cages, or colocation racks are access-controlled and logged.
{{/if}}
{{#if requires_biometric_rack_access}}
- Biometric or equivalent high-assurance access controls protect physical racks and cages.
{{/if}}
{{#if tracks_media_destruction}}
- Media destruction certificates or destruction logs are retained for retired drives and removable media.
{{/if}}
{{/if}}

{{#if uses_hybrid}}
## Hybrid Environment Requirements
- Physical site controls for on-premise assets are reviewed together with cloud identity and network controls.
{{#if uses_cloud_vpn}}
- VPN and bastion access logs bridging cloud and on-premise environments are retained and reviewed.
{{/if}}
{{/if}}

{{#if has_office_locations}}
## Office Locations
{{#each office_locations}}
- {{city}}, {{country}}: {{security_notes}}
{{/each}}
{{else}}
{{organization_name}} primarily operates remotely and relies on device-level controls and approved coworking practices.
{{/if}}
